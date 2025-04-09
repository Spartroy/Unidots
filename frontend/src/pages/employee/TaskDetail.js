import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, DocumentTextIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch task details
        const taskResponse = await axios.get(`/api/tasks/${id}`);
        setTask(taskResponse.data);
        
        // Fetch task comments
        const commentsResponse = await axios.get(`/api/tasks/${id}/comments`);
        setComments(commentsResponse.data);
        
        // Fetch task files
        const filesResponse = await axios.get(`/api/tasks/${id}/files`);
        setUploadedFiles(filesResponse.data);
      } catch (error) {
        toast.error('Failed to load task details');
        console.error('Task details fetch error:', error);
        navigate('/employee/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, navigate]);
  
  // Handle file drops
  const onDrop = acceptedFiles => {
    // Add new files to the existing files array
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  };
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/vnd.adobe.illustrator': ['.ai'],
      'application/postscript': ['.eps'],
      'application/x-indesign': ['.indd'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10485760, // 10MB
  });
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to format datetime for comments
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine task status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to update task status
  const updateTaskStatus = async (newStatus) => {
    try {
      setSubmitting(true);
      await axios.put(`/api/tasks/${id}/status`, { status: newStatus });
      
      // Update the task in the local state
      setTask({ ...task, status: newStatus });
      
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Task update error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Function to add a comment
  const addComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await axios.post(`/api/tasks/${id}/comments`, { content: newComment });
      
      // Add the new comment to the comments array
      setComments([...comments, response.data]);
      
      // Clear the comment input
      setNewComment('');
      
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Comment add error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Function to upload files
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    try {
      setUploading(true);
      
      // Create form data for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('taskId', id);
      
      // Append all files
      files.forEach(file => {
        uploadFormData.append('files', file);
      });
      
      // Upload files
      const response = await axios.post('/api/files/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add the new files to the uploaded files array
      setUploadedFiles([...uploadedFiles, ...response.data]);
      
      // Clear the files array
      setFiles([]);
      
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };
  
  // Function to download a file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/api/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download file');
      console.error('File download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <p className="text-center text-gray-500">Task not found or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Task ID: {task._id}
            </p>
          </div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(task.dueDate)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.priority || 'Normal'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Related Order</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.order ? (
                  <Link to={`/employee/orders/${task.order._id}`} className="text-secondary-600 hover:text-secondary-900">
                    {task.order.orderNumber}
                  </Link>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.description}</dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          <div className="flex space-x-3">
            {task.status !== 'in_progress' && task.status !== 'completed' && (
              <button
                onClick={() => updateTaskStatus('in_progress')}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Start Task
              </button>
            )}
            
            {task.status !== 'completed' && (
              <button
                onClick={() => updateTaskStatus('completed')}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Mark as Completed
              </button>
            )}
            
            <Link
              to="/employee/tasks"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Files section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Files</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Task attachments and related documents
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {/* File upload dropzone */}
          <div 
            {...getRootProps()} 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragActive ? 'border-secondary-500 bg-secondary-50' : 'border-gray-300'}`}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <input {...getInputProps()} />
                <p className="pl-1">
                  Drag and drop files here, or click to select files
                </p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, XLS, AI, EPS, JPG, PNG up to 10MB</p>
            </div>
          </div>
          
          {/* Selected files list */}
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
              <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="font-medium text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload Files'}
                </button>
              </div>
            </div>
          )}
          
          {/* Uploaded files list */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700">Attached Files</h4>
            {uploadedFiles.length > 0 ? (
              <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                {uploadedFiles.map((file) => (
                  <li key={file._id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className="ml-2 flex-1 w-0 truncate">{file.originalName}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => downloadFile(file._id, file.originalName)}
                        className="font-medium text-secondary-600 hover:text-secondary-500"
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No files attached to this task yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Comments</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Task discussion and updates
          </p>
        </div>
        <div className="border-t border-gray-200">
          {/* Comments list */}
          <ul className="divide-y divide-gray-200">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment._id} className="px-4 py-4 sm:px-6">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-secondary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(comment.createdAt)}
                      </p>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No comments yet.
              </li>
            )}
          </ul>
          
          {/* Add comment form */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <form onSubmit={addComment} className="relative">
              <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-secondary-500 focus-within:ring-1 focus-within:ring-secondary-500">
                <textarea
                  rows={3}
                  name="comment"
                  id="comment"
                  className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <div className="py-2 px-3 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;