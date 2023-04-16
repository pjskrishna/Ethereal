import React,{useState,useEffect} from 'react'
import './DisplayTransactions.css'
import { useParams } from 'react-router-dom'

import useBasicDetails from "../../hooks/useBasicDetails";


const DisplayTransactions = () => {
  const { id } = useParams();

  
  const [transactionHistory, setTransactionHistory] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  const [web3,account,contract,contractAddress]=useBasicDetails()


  useEffect(() => {
    const getContractDetails = async () => {
      let transactionNumber = await contract.methods.transacNum().call();

      for (let i = 1; i <= transactionNumber; i++) {
        await contract.methods
          .transactions(i)
          .call()
          .then((res) => {
            // eslint-disable-next-line
            if (res.accountSerialNumber == id) {
              console.log(res);
              var transac = transactionHistory;
              transac.push(res);
              setTransactionHistory(transac);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      setLoading(false);
    };
    if (
      typeof contract !== "undefined" &&
      typeof account !== "undefined" &&
      typeof web3 !== "undefined"
    ) {
      getContractDetails();
    }
    // eslint-disable-next-line
  }, [web3, account, contract]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="account-transaction-wrapper">
      <div className="account-transactions">
        <h1> TRANSACTION HISTORY</h1>
        <div className="account-transaction-bars">
          <div className="transaction-bar-header">
            <div className="col-1">
              <h2> AMT.</h2>
            </div>
            <div className="col-2">
              <h2>TYPE</h2>
            </div>
            <div className="col-3">
              <h2>BALANCE</h2>
            </div>
            <div className="col-4">
              <h2>TIME</h2>
            </div>
          </div>
          {
            // !loading?
            transactionHistory.map((transaction) => {
              var time = new Date(
                transaction.createdAt * 1000
              ).toLocaleString();

              return (
                <div className="transaction-bar">
                  <div className="col-1">
                    <h2>{transaction.amountTransacted}</h2>
                  </div>
                  <div className="col-2">
                    <h2>{transaction.transacType}</h2>
                  </div>
                  <div className="col-3">
                    <h2>{transaction.currentBalance}</h2>
                  </div>
                  <div className="col-4">
                    <h2>{time}</h2>
                  </div>
                </div>
              );
            })
            // :null
          }
        </div>
     
      </div>

      <div className="display-transaction-image">
        <img src="/assets/6.svg" alt=""/>
      </div>
    </div>
  );
}

export default DisplayTransactions
