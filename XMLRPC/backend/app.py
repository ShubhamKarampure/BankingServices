from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn

class CORSRequestHandler(SimpleXMLRPCRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

class ThreadedXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    pass

# Initial Balance
balance = 1000

# Define Banking Functions
def deposit(amount):
    global balance
    if amount > 0:
        balance += amount
        return balance
    else:
        return "Invalid deposit amount"

def withdraw(amount):
    global balance
    if 0 < amount <= balance:
        balance -= amount
        return balance
    else:
        return "Invalid withdrawal amount or insufficient funds"

def get_balance():
    return balance

# Start the XML-RPC Server
with ThreadedXMLRPCServer(('localhost', 8000), requestHandler=CORSRequestHandler) as server:
    server.register_introspection_functions()
    server.register_function(deposit, 'deposit')
    server.register_function(withdraw, 'withdraw')
    server.register_function(get_balance, 'get_balance')
    print("XML-RPC Server is running on port 8000 with CORS support...")
    server.serve_forever()
