#include "hashcode.hpp"

namespace eosio {

    using std::string;

    class hashcode : public contract {
        using contract::contract;

        public:
            hashcode(account_name self):contract(self) {}

            void add(const account_name account, string& username) {
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

        private:

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
                uint64_t username;
                uint64_t number;
                uint64_t points;

                uint64_t primary_key() const { return account_name; }

                EOSLIB_SERIALIZE(content, (account_name)(username)(number)(points))
            };


    };
    EOSIO_ABI(hashcode, (add)(gethasher))
}


