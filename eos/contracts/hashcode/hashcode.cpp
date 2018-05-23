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

                if(user_point<content_point){print("Not enough points. Please check again.")}
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
    EOSIO_ABI(hashcode, (addhasher)(gethasher)(writecontent)(getcontent))
}

