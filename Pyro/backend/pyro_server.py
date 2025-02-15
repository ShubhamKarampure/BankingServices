import Pyro4

# Banking Service Class
@Pyro4.expose
class BankingService:
    def __init__(self):
        self.balance = 1000  # Starting balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return self.balance
        else:
            return "Invalid deposit amount"

    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            return self.balance
        else:
            return "Invalid withdrawal amount or insufficient funds"

    def get_balance(self):
        return self.balance

# Pyro4 Daemon
def main():
    # Create a Pyro4 Daemon
    daemon = Pyro4.Daemon(host="localhost", port=9090)
    
    # Register the BankingService
    uri = daemon.register(BankingService, "banking.service")
    
    print("Pyro4 Banking Service is running...")
    print("URI:", uri)
    
    # Start the event loop of the server to wait for calls
    daemon.requestLoop()

if __name__ == "__main__":
    main()
