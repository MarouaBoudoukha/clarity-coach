'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Award, Share2, Download, Mail } from 'lucide-react';
import { useState } from 'react';

interface ClaritySnapshotProps {
  snapshot: {
    situation: string;
    belief: string;
    feeling: string;
    mental: string;
    action: string;
    mantra: string;
    affirmation: string;
    journal: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export default function ClaritySnapshot({ snapshot, onClose, onSave }: ClaritySnapshotProps) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const handleEmailSubmit = () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // In a real app, this would send an API request to email the snapshot
    console.log(`Sending snapshot to ${email}`);
    setEmailSent(true);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center">
          <Award className="mr-2" /> Clarity Snapshot
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Situation</h3>
          <p className="text-gray-800 dark:text-gray-100">{snapshot.situation}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Belief Identified</h3>
          <p className="text-gray-800 dark:text-gray-100">{snapshot.belief}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gut Feeling</h3>
          <p className="text-gray-800 dark:text-gray-100">{snapshot.feeling}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mental Response</h3>
          <p className="text-gray-800 dark:text-gray-100">{snapshot.mental}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aligned Action</h3>
          <p className="text-gray-800 dark:text-gray-100 font-medium">{snapshot.action}</p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">✨ BONUS TOOLS</h3>
          
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily Mantra</h4>
            <p className="text-gray-800 dark:text-gray-100 italic">"{snapshot.mantra}"</p>
          </div>
          
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Affirmation</h4>
            <p className="text-gray-800 dark:text-gray-100">{snapshot.affirmation}</p>
          </div>
          
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Journal Prompt</h4>
            <p className="text-gray-800 dark:text-gray-100">{snapshot.journal}</p>
          </div>
        </div>
      </div>
      
      {!emailSent ? (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Would you like a copy sent to your email so you can revisit it later?
          </p>
          
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <Button 
              onClick={handleEmailSubmit}
              className="px-4"
            >
              <Mail size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            ✓ Your Clarity Snapshot has been sent to {email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Would you like to save this snapshot for future reference? (Premium feature)
          </p>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <div className="flex space-x-2">
          <Button
            onClick={() => alert('Downloading snapshot...')}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <Download size={16} className="mr-1" /> Save
          </Button>
          <Button
            onClick={() => alert('Sharing snapshot...')}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <Share2 size={16} className="mr-1" /> Share
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={onClose}
            className="px-4 bg-gray-200 text-gray-800"
          >
            Close
          </Button>
          <Button
            onClick={onSave}
            className="px-4"
          >
            Save to My Snapshots
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        Clarity AI provides general information only. It is not medical, financial, therapeutic, or professional advice, and may not reflect Our Company's views or always be accurate.
      </div>
    </div>
  );
} 