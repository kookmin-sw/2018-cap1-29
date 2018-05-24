user#include <utility>
#include <vector>
#include <string>
#include <eosiolib/eosio.hpp>
#include <eosiolib/time.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/contract.hpp>
#include <eosiolib/crypto.h>

using eosio::key256;
using eosio::indexed_by;
using eosio::const_mem_fun;
using eosio::asset;
using eosio::permission_level;
using eosio::action;
using eosio::print;
using eosio::name;

class hashcode2 : public eosio::contract {
   public:
      const uint32_t VOTING_TERM = 7*24*60*60;

      hashcode2(account_name self)
      :eosio::contract(self),
       question_offers(_self, _self),
       contents(_self, _self),
       global_dices(_self, _self),
       accounts(_self, _self)
      {}

      //@abi action
      void question(const asset& money, const account_name writer, const checksum256& commitment) {

         eosio_assert( money.symbol == CORE_SYMBOL, "only core token allowed(EOS)" );
         eosio_assert( money.is_valid(), "invalid money" );
         eosio_assert( money.amount > 0, "must money positive quantity" );

         eosio_assert( !has_question_offer( commitment ), "question_offer with this commitment already exist" );
         require_auth( writer );

         auto cur_user_itr = accounts.find( writer );
         eosio_assert(cur_user_itr != accounts.end(), "unknown account");

         // Store new question_offer
         auto new_question_offer_itr = question_offers.emplace(_self, [&](auto& question_offer){
            question_offer.id         = question_offers.available_primary_key();
            question_offer.money        = money;
            question_offer.owner      = writer;
            question_offer.commitment = commitment;
            question_offer.questionid     = 0;
         });

         // Try to find a matching money
         auto idx = question_offers.template get_index<N(money)>();
         auto matched_question_offer_itr = idx.lower_bound( (uint64_t)new_question_offer_itr->money.amount );

         if( matched_question_offer_itr == idx.end()
            || matched_question_offer_itr->money != new_question_offer_itr->money
            || matched_question_offer_itr->owner == new_question_offer_itr->owner ) {

            // No matching money found, update user's account
            accounts.modify( cur_user_itr, 0, [&](auto& acnt) {
               eosio_assert( acnt.eos_balance >= money, "insufficient balance" );
               acnt.eos_balance -= money;
               acnt.open_question_offers++;
            });

         } else {
            // Create global content counter if not exists
            auto gdice_itr = global_dices.begin();
            if( gdice_itr == global_dices.end() ) {
               gdice_itr = global_dices.emplace(_self, [&](auto& gdice){
                  gdice.nextquestionid=0;
               });
            }

            // Increment global content counter
            global_dices.modify(gdice_itr, 0, [&](auto& gdice){
               gdice.nextquestionid++;
            });

            // Create a new content
            auto content_itr = contents.emplace(_self, [&](auto& new_content){
               new_content.id       = gdice_itr->nextquestionid;
               new_content.money      = new_question_offer_itr->money;
               new_content.deadline = eosio::time_point_sec(0);

               new_content.user1.commitment = matched_question_offer_itr->commitment;
               memset(&new_content.user1.reveal, 0, sizeof(checksum256));

               new_content.user2.commitment = new_question_offer_itr->commitment;
               memset(&new_content.user2.reveal, 0, sizeof(checksum256));
            });

            // Update user's question_offers
            idx.modify(matched_question_offer_itr, 0, [&](auto& question_offer){
               question_offer.money.amount = 0;
               question_offer.questionid = content_itr->id;
            });

            question_offers.modify(new_question_offer_itr, 0, [&](auto& question_offer){
               question_offer.money.amount = 0;
               question_offer.questionid = content_itr->id;
            });

            // Update user's accounts
            accounts.modify( accounts.find( matched_question_offer_itr->owner ), 0, [&](auto& acnt) {
               acnt.open_question_offers--;
               acnt.open_contents++;
            });

            accounts.modify( cur_user_itr, 0, [&](auto& acnt) {
               eosio_assert( acnt.eos_balance >= money, "insufficient balance" );
               acnt.eos_balance -= money;
               acnt.open_contents++;
            });
         }
      }

      //@abi action
      void cancelquestion_offer( const checksum256& commitment ) {

         auto idx = question_offers.template get_index<N(commitment)>();
         auto question_offer_itr = idx.find( question_offer::get_commitment(commitment) );

         eosio_assert( question_offer_itr != idx.end(), "question_offer does not exists" );
         eosio_assert( question_offer_itr->questionid == 0, "unable to cancel question_offer" );
         require_auth( question_offer_itr->owner );

         auto acnt_itr = accounts.find(question_offer_itr->owner);
         accounts.modify(acnt_itr, 0, [&](auto& acnt){
            acnt.open_question_offers--;
            acnt.eos_balance += question_offer_itr->money;
         });

         idx.erase(question_offer_itr);
      }

      //@abi action
      void reveal( const checksum256& commitment, const checksum256& source ) {

         assert_sha256( (char *)&source, sizeof(source), (const checksum256 *)&commitment );

         auto idx = question_offers.template get_index<N(commitment)>();
         auto curr_revealer_question_offer = idx.find( question_offer::get_commitment(commitment)  );

         eosio_assert(curr_revealer_question_offer != idx.end(), "question_offer not found");
         eosio_assert(curr_revealer_question_offer->questionid > 0, "unable to reveal");

         auto content_itr = contents.find( curr_revealer_question_offer->questionid );

         user curr_reveal = content_itr->user1;
         user prev_reveal = content_itr->user2;

         if( !is_equal(curr_reveal.commitment, commitment) ) {
            std::swap(curr_reveal, prev_reveal);
         }

         eosio_assert( is_zero(curr_reveal.reveal) == true, "user already revealed");

         if( !is_zero(prev_reveal.reveal) ) {

            checksum256 result;
            sha256( (char *)&content_itr->user1, sizeof(user)*2, &result);

            auto prev_revealer_question_offer = idx.find( question_offer::get_commitment(prev_reveal.commitment) );

            int winner = result.hash[1] < result.hash[0] ? 0 : 1;

            if( winner ) {
               select_answer(*content_itr, *curr_revealer_question_offer, *prev_revealer_question_offer);
            } else {
               select_answer(*content_itr, *prev_revealer_question_offer, *curr_revealer_question_offer);
            }

         } else {
            contents.modify(content_itr, 0, [&](auto& content){

               if( is_equal(curr_reveal.commitment, content.user1.commitment) )
                  content.user1.reveal = source;
               else
                  content.user2.reveal = source;

               content.deadline = eosio::time_point_sec(now() + VOTING_TERM);
            });
         }
      }

      //@abi action
      void claimexpired( const uint64_t questionid ) {

         auto content_itr = contents.find(questionid);

         eosio_assert(content_itr != contents.end(), "content not found");
         eosio_assert(content_itr->deadline != eosio::time_point_sec(0) && eosio::time_point_sec(now()) > content_itr->deadline, "content not expired");

         auto idx = question_offers.template get_index<N(commitment)>();
         auto user1_question_offer = idx.find( question_offer::get_commitment(content_itr->user1.commitment) );
         auto user2_question_offer = idx.find( question_offer::get_commitment(content_itr->user2.commitment) );

         if( !is_zero(content_itr->user1.reveal) ) {
            eosio_assert( is_zero(content_itr->user2.reveal), "content error");
            select_answer(*content_itr, *user1_question_offer, *user2_question_offer);
         } else {
            eosio_assert( is_zero(content_itr->user1.reveal), "content error");
            select_answer(*content_itr, *user2_question_offer, *user1_question_offer);
         }

      }

      //@abi action
      void deposit( const account_name from, const asset& quantity ) {

         eosio_assert( quantity.is_valid(), "invalid quantity" );
         eosio_assert( quantity.amount > 0, "must deposit positive quantity" );

         auto itr = accounts.find(from);
         if( itr == accounts.end() ) {
            itr = accounts.emplace(_self, [&](auto& acnt){
               acnt.owner = from;
            });
         }

         action(
            permission_level{ from, N(active) },
            N(eosio.token), N(transfer),
            std::make_tuple(from, _self, quantity, std::string(""))
         ).send();

         accounts.modify( itr, 0, [&]( auto& acnt ) {
            acnt.eos_balance += quantity;
         });
      }

      //@abi action
      void withdraw( const account_name to, const asset& quantity ) {
         require_auth( to );

         eosio_assert( quantity.is_valid(), "invalid quantity" );
         eosio_assert( quantity.amount > 0, "must withdraw positive quantity" );

         auto itr = accounts.find( to );
         eosio_assert(itr != accounts.end(), "unknown account");

         accounts.modify( itr, 0, [&]( auto& acnt ) {
            eosio_assert( acnt.eos_balance >= quantity, "insufficient balance" );
            acnt.eos_balance -= quantity;
         });

         action(
            permission_level{ _self, N(active) },
            N(eosio.token), N(transfer),
            std::make_tuple(_self, to, quantity, std::string(""))
         ).send();

         if( itr->is_empty() ) {
            accounts.erase(itr);
         }
      }

   private:
      //@abi table question_offer i64
      struct question_question_offer {
         uint64_t          id;
         account_name      owner;
         asset             money;
         checksum256       commitment;
         uint64_t          questionid = 0;

         uint64_t primary_key()const { return id; }

         uint64_t by_money()const { return (uint64_t)money.amount; }

         key256 by_commitment()const { return get_commitment(commitment); }

         static key256 get_commitment(const checksum256& commitment) {
            const uint64_t *p64 = reinterpret_cast<const uint64_t *>(&commitment);
            return key256::make_from_word_sequence<uint64_t>(p64[0], p64[1], p64[2], p64[3]);
         }

         EOSLIB_SERIALIZE( question_question_offer, (id)(owner)(money)(commitment)(questionid) )
      };

      typedef eosio::multi_index< N(question_question_offer), question_question_offer,
         indexed_by< N(money), const_mem_fun<question_question_offer, uint64_t, &question_question_offer::by_money > >,
         indexed_by< N(commitment), const_mem_fun<question_question_offer, key256,  &question_question_offer::by_commitment> >
      > question_question_offer_index;

      struct user {
         checksum256 commitment;
         checksum256 reveal;

         EOSLIB_SERIALIZE( user, (commitment)(reveal) )
      };

      //@abi table content i64
      struct content {
         uint64_t id;
         asset    money;
         eosio::time_point_sec deadline;
         user   user1;
         user   user2;

         uint64_t primary_key()const { return id; }

         EOSLIB_SERIALIZE( content, (id)(money)(deadline)(user1)(user2) )
      };

      typedef eosio::multi_index< N(content), content> content_index;

      //@abi table global i64
      struct global_dice {
         uint64_t id = 0;
         uint64_t nextquestionid = 0;

         uint64_t primary_key()const { return id; }

         EOSLIB_SERIALIZE( global_dice, (id)(nextquestionid) )
      };

      typedef eosio::multi_index< N(global), global_dice> global_dice_index;

      //@abi table account i64
      struct account {
         account( account_name o = account_name() ):owner(o){}

         account_name owner;
         asset        eos_balance;
         uint32_t     open_upvote = 0;
         uint32_t     level = 1;
         uint32_t     experience = 0;

         bool is_empty()const { return !( eos_balance.amount | open_question_offers | open_contents ); }

         uint64_t primary_key()const { return owner; }

         EOSLIB_SERIALIZE( account, (owner)(eos_balance)(open_upvote)(level)(experience) )
      };

      typedef eosio::multi_index< N(account), account> account_index;

      question_offer_index       question_offers;
      content_index        contents;
      global_dice_index global_dices;
      account_index     accounts;

      bool has_question_offer( const checksum256& commitment )const {
         auto idx = question_offers.template get_index<N(commitment)>();
         auto itr = idx.find( question_offer::get_commitment(commitment) );
         return itr != idx.end();
      }

      bool is_equal(const checksum256& a, const checksum256& b)const {
         return memcmp((void *)&a, (const void *)&b, sizeof(checksum256)) == 0;
      }

      bool is_zero(const checksum256& a)const {
         const uint64_t *p64 = reinterpret_cast<const uint64_t*>(&a);
         return p64[0] == 0 && p64[1] == 0 && p64[2] == 0 && p64[3] == 0;
      }

      void select_answer(const content& g, const question_offer& winner70_question_offer,
          const question_offer& winner30_question_offer) {

         // Update winner account balance and content count
         auto winner70_account = accounts.find(winner70_question_offer.owner);
         accounts.modify( winner70_account, 0, [&]( auto& acnt ) {
            acnt.eos_balance += 1.7*g.money;
            acnt.experience++;
         });

         // Update losser account content count
         auto winner30_account = accounts.find(winner30_question_offer.owner);
         accounts.modify( winner30_account, 0, [&]( auto& acnt ) {
            acnt.eos_balance += 1.3*g.money;
            acnt.experience++;
         });

         if( loser_account->is_empty() ) {
            accounts.erase(loser_account);
         }

         contents.erase(g);
         question_offers.erase(winner_question_offer);
         question_offers.erase(loser_question_offer);
      }
};

EOSIO_ABI( hashcode2, (question)(cancelquestion_offer)(reveal)(claimexpired)(deposit)(withdraw) )
