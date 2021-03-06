#include "hashcode.hpp"

namespace eosio {

    using std::string;

    class hashcode : public contract {
        using contract::contract;
        account_name owner;

        public:
            hashcode(account_name self):contract(self) {}

            void addhasher(const account_name account, string& username) {
                /**
                 * We require that only the owner of an account can use this action
                 * or somebody with the account authorization
                */
                require_auth(account);

                /**
                 * We access the "hasher" table as creating an object of type "hasherIndex"
                 * As parameters we pass code & scope - _self from the parent contract
                */
                hasherIndex hashers(_self, _self);

                /**
                 * We must verify that the account doesn't exist yet
                 * If the account is not found the iterator variable should be hashers.end()
                */
                auto iterator = hashers.find(account);
                eosio_assert(iterator == hashers.end(), "Address for account already exists");

                /**
                 * We add the new hasher in the table
                 * The first argument is the payer of the storage which will store the data
                */
                hashers.emplace(account, [&](auto& hasher) {
                    hasher.account_name = account;
                    hasher.username = username;
                    hasher.level = 1;
                    hasher.points = 500;
                    hasher.experience = 0;
                });
            }


            void gethasher(const account_name account) {
                hasherIndex hashers(_self, _self);

                auto iterator = hashers.find(account);
                eosio_assert(iterator != hashers.end(), "Address for account not found");

                /**
                 * The "get" function returns a constant reference to the object
                 * containing the specified secondary key
                */
                auto currentHasher = hashers.get(account);
                print("Username: ", currentHasher.username.c_str(), " Level: ", currentHasher.level, " Points: ", currentHasher.points, " Experience: ", currentHasher.experience);
            }

            void writecontent(const account_name account, string& username, string& content_name, uint64_t content_number, uint64_t content_point){
                require_auth(account);

                contentIndex contents(_self, _self);
                hasherIndex hashers(_self, _self);

                auto iterator = hashers.find(account);
                eosio_assert(iterator != hashers.end(), "Address for account not found");

                auto currentHasher = hashers.get(account);
                auto user_point = currentHasher.points;

                if(user_point<content_point){print("Not enough points. Please check again.");}
                if(content_number < current_no){print("The content number is lower than current_no. Please check again.");}

                contents.emplace(content_number, [&](auto& content){
                  content.account_name = account;
                  content.username = username;
                  content.content_name = content_name;
                  content.number = content_number;
                  content.points = content_point;
                });

            }

            void getcontent(const uint64_t content_number){
                contentIndex contents(_self, _self);

                auto iterator = contents.find(content_number);
                eosio_assert(iterator != contents.end(), "Content number not found");

                auto currentContent = contents.get(content_number);
                print("Username: ", currentContent.username.c_str(), " Content-name: ", currentContent.content_name.c_str(), " Content-number: ", currentContent.number, " Content-points: ", currentContent.points);
            }

            void donate(const account_name from_account, const account_name to_account, uint64_t points){
                require_auth(from_account);
                hasherIndex hashers(_self, _self);
                auto iterator = hashers.find(from_account);
                eosio_assert(iterator != hashers.end(), "Your Address for account not found");

                iterator = hashers.find(to_account);
                eosio_assert(iterator != hashers.end(), "Receiver's Address for account not found");

                auto currentHasher = hashers.get(from_account);
                auto from_point = currentHasher.points;
                if(from_point<points){print("Not enough points. Please check again.");}
                else{
                    from_point = from_point - points;
                    auto currentHasher = hashers.get(to_account);
                    auto to_point = currentHasher.points;
                    to_point = to_point + points;
                }

            }

            void chooseanswer(const account_name account, uint64_t content_number, const account_name account_70, const account_name account_30){
                require_auth(account);
                hasherIndex hashers(_self, _self);
                contentIndex contents(_self, _self);
                auto currentContent = contents.get(content_number);
                auto points = currentContent.points;

                auto iterator = hashers.find(account);
                eosio_assert(iterator != hashers.end(), "Your Address for account not found");
                iterator = hashers.find(account_70);
                eosio_assert(iterator != hashers.end(), "Receiver(70)'s Address for account not found");
                hashers.modify(iterator, account_70, [&](auto& hasher){
                    hasher.points = hasher.points + (0.7 * points);
                });
                iterator = hashers.find(account_30);
                eosio_assert(iterator != hashers.end(), "Receiver(30)'s Address for account not found");
                hashers.modify(iterator, account_30, [&](auto& hasher){
                    hasher.points = hasher.points + (0.3 * points);
                });
                auto iter = contents.find(content_number);
                eosio_assert(iter != contents.end(), "Wrong content number");
                contents.modify(iter, content_number, [&](auto& content){
                  content.writer_select_account = account_70;
                  content.hasher_select_account = account_30;
                });
            }

        private:
            uint64_t current_no = 0;

            //@abi table hasher i64
            struct hasher {
                uint64_t account_name;
                string username;
                uint64_t level = 1;
                uint64_t points = 500;
                uint64_t experience = 0;

                uint64_t primary_key() const { return account_name; }

                EOSLIB_SERIALIZE(hasher, (account_name)(username)(level)(points)(experience))
            };

            typedef multi_index<N(hasher), hasher> hasherIndex;

            struct content {
                uint64_t account_name;
                string username;
                string content_name;
                uint64_t number;
                uint64_t points = 0;
                uint64_t writer_select_account = 0;
                uint64_t hasher_select_account = 0;

                uint64_t primary_key() const { return number; }

                EOSLIB_SERIALIZE(content, (account_name)(username)(content_name)(number)(points)(writer_select_account)(hasher_select_account))
            };

            typedef multi_index<N(content),content> contentIndex;



    };
    EOSIO_ABI(hashcode, (addhasher)(gethasher)(writecontent)(getcontent)(donate)(chooseanswer))
}

