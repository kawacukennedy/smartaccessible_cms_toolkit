import React from 'react';

const MediaLibrary = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Media Library</h2>
      </div>
      <div className="p-4">
        <div className="border-dashed border-2 border-gray-400 rounded-lg p-8 text-center mb-4">
          <p className="text-gray-500">Drag & drop files here or click to upload</p>
          <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Bulk Upload
          </button>
        </div>
        {/* Placeholder for media items */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-2">
            <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-md mb-2"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200">image1.jpg</p>
            <button className="text-xs text-blue-500 hover:underline">AI alt text</button>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-2">
            <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-md mb-2"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200">image2.png</p>
            <button className="text-xs text-blue-500 hover:underline">AI alt text</button>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-2">
            <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-md mb-2"></div>
            <p className="text-sm text-gray-800 dark:text-gray-200">video1.mp4</p>
            <button className="text-xs text-blue-500 hover:underline">AI alt text</button>
          </div>
        </div>
        <div className="mt-4">
            <p className="text-sm">Uploading image3.gif...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
