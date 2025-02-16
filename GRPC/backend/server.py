import grpc
from concurrent import futures
import banking_pb2
import banking_pb2_grpc

# In-memory data storage
balance = 1000  # Initial balance

class BankingService(banking_pb2_grpc.BankingServiceServicer):

    def GetBalance(self, request, context):
        return banking_pb2.BalanceResponse(balance=balance)
    
    def PerformTransaction(self, request, context):
        global balance
        if request.type == "deposit":
            balance += request.amount
            return banking_pb2.TransactionResponse(
                status="success",
                new_balance=balance
            )
        elif request.type == "withdrawal":
            if request.amount > balance:
                return banking_pb2.TransactionResponse(
                    status="insufficient_funds",
                    new_balance=balance
                )
            balance -= request.amount
            return banking_pb2.TransactionResponse(
                status="success",
                new_balance=balance
            )
        else:
            return banking_pb2.TransactionResponse(
                status="invalid_type",
                new_balance=balance
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    banking_pb2_grpc.add_BankingServiceServicer_to_server(BankingService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC server started on port 50051.")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
