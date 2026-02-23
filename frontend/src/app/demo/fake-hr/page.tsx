
import React from 'react';

export default function FakeHR() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 p-8">
      <div className="max-w-3xl mx-auto border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Email Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">ACTION REQUIRED: Employee Payroll Verification - Q1 2025</h1>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">High Importance</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">HR</div>
            <div>
              <p className="font-medium text-gray-900">Human Resources (hr-verify@microsoft-support-team.com)</p>
              <p>To: You</p>
            </div>
            <div className="ml-auto text-gray-500">Today, 10:42 AM</div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6 space-y-4">
          <p>Dear Employee,</p>
          
          <p>We are updating our payroll system for the upcoming fiscal quarter. To ensure your salary is processed correctly and to avoid any delays in your next paycheck, please review and confirm your direct deposit information.</p>
          
          <p className="font-bold text-red-600">Failure to verify your details within 24 hours may result in a suspension of your direct deposit.</p>
          
          <div className="my-6 p-4 bg-blue-50 border border-blue-100 rounded text-center">
            <p className="mb-2 font-medium">Click below to access the secure portal:</p>
            <a href="http://payroll-secure-update.net/microsoft/login" className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition duration-150">
              Verify Payroll Information
            </a>
            <p className="text-xs text-gray-500 mt-2">Link expires in 24 hours.</p>
          </div>

          <p>If you have any questions, please contact the HR Helpdesk immediately.</p>
          
          <p>Sincerely,<br/>Microsoft HR Team</p>
          
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400">
            <p>This email was sent from an unmonitored mailbox. Please do not reply to this message.</p>
            <p>Microsoft Corporation, One Microsoft Way, Redmond, WA 98052 USA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
