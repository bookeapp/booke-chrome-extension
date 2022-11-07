import React from "react";
import IconArrowRight from "./lib/IconArrowRight";

const Accounts = () => {
  return (
    <div className="Accounts">
      <div className="title">Accounts</div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell table-head name-cell">Account</div>
          <div className="table-cell table-head to-reconcile-cell">To Reconcile</div>
          <div className="table-cell table-head action-cell" />
        </div>  
        <div className="table-row">
          <div className="table-cell name-cell">Stripe Bank Account</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">6</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Reserve Account CD</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">69</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Flip Cause</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">34</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Undeposited Funds</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">25</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Stripe Bank Account</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">6</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Reserve Account CD</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">69</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Flip Cause</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">34</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
        <div className="table-row">
          <div className="table-cell name-cell">Undeposited Funds</div>
          <div className="table-cell to-reconcile-cell">
            <div className="badge">25</div>
          </div>
          <div className="table-cell action-cell">
            <div className="button">Go to <IconArrowRight /></div>
          </div>
        </div>        
      </div>  
    </div> 
  );
};

export default Accounts;