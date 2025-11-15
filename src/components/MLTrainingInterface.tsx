import React, { useState } from 'react';
import { Brain, Upload, TrendingUp, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrainingData {
  id: string;
  fileName: string;
  recordCount: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  accuracy?: number;
}

interface ConnectDBProps {
  onConnect: () => void;
}

const ConnectDBButton: React.FC<ConnectDBProps> = ({ onConnect }) => (
  <Button
    onClick={onConnect}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    <Database className="w-4 h-4 mr-2" />
    Connect DB
  </Button>
);

export const MLTrainingInterface: React.FC = () => {
  const { toast } = useToast();
  const [trainingDatasets, setTrainingDatasets] = useState<TrainingData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(87.5);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newDataset: TrainingData = {
      id: `ds_${Date.now()}`,
      fileName: file.name,
      recordCount: Math.floor(Math.random() * 10000) + 1000,
      uploadedAt: new Date().toISOString(),
      status: 'processing'
    };

    setTrainingDatasets(prev => [newDataset, ...prev]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Simulate processing
    setTimeout(() => {
      setTrainingDatasets(prev => 
        prev.map(ds => 
          ds.id === newDataset.id 
            ? { ...ds, status: 'completed', accuracy: Math.random() * 10 + 85 }
            : ds
        )
      );
      setUploadProgress(0);
      toast({
        title: "Dataset Uploaded",
        description: `${file.name} has been processed successfully.`
      });
    }, 2000);
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    toast({
      title: "Model Training Started",
      description: "Training ML model with historical threat data..."
    });

    // Simulate training
    await new Promise(resolve => setTimeout(resolve, 5000));

    const newAccuracy = Math.min(99, modelAccuracy + Math.random() * 5);
    setModelAccuracy(newAccuracy);
    setIsTraining(false);

    toast({
      title: "Training Complete",
      description: `Model accuracy improved to ${newAccuracy.toFixed(2)}%`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">ML Training Interface</h2>
        <ConnectDBButton onConnect={() => setShowConnectModal(true)} />
      </div>

      {/* Current Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur rounded-lg p-6 border-2 border-purple-500/50">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Model Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{modelAccuracy.toFixed(2)}%</p>
          <p className="text-sm text-gray-400 mt-1">Current prediction accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur rounded-lg p-6 border-2 border-blue-500/50">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Training Datasets</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{trainingDatasets.length}</p>
          <p className="text-sm text-gray-400 mt-1">Uploaded datasets</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur rounded-lg p-6 border-2 border-green-500/50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Total Records</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {trainingDatasets.reduce((acc, ds) => acc + ds.recordCount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 mt-1">Training records</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Upload Historical Threat Data</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Upload CSV, JSON, or XLSX files</p>
            <input
              type="file"
              accept=".csv,.json,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" asChild>
                <span>Select File</span>
              </Button>
            </label>
          </div>

          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Training Control */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Model Training</h3>
        <div className="flex gap-4">
          <Button
            onClick={handleTrainModel}
            disabled={isTraining || trainingDatasets.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isTraining ? 'Training...' : 'Train Model'}
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Training Metrics
          </Button>
        </div>
        {isTraining && (
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg">
            <p className="text-purple-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 animate-pulse" />
              Training in progress... This may take several minutes.
            </p>
          </div>
        )}
      </div>

      {/* Datasets List */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Training Datasets</h3>
        <div className="space-y-3">
          {trainingDatasets.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No datasets uploaded yet</p>
          ) : (
            trainingDatasets.map(dataset => (
              <div key={dataset.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{dataset.fileName}</h4>
                    <p className="text-sm text-gray-400">
                      {dataset.recordCount.toLocaleString()} records • {new Date(dataset.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dataset.status === 'completed' && (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        {dataset.accuracy && (
                          <span className="text-green-400 text-sm font-semibold">
                            {dataset.accuracy.toFixed(1)}%
                          </span>
                        )}
                      </>
                    )}
                    {dataset.status === 'processing' && (
                      <div className="text-yellow-400 text-sm animate-pulse">Processing...</div>
                    )}
                    {dataset.status === 'failed' && (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
