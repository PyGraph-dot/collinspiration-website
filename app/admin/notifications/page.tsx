// app/admin/notifications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react'; // ADDED Trash2 here
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      const sortedMessages = data.sort((a: ContactMessage, b: ContactMessage) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sortedMessages);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching messages.');
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete message');
      }

      toast.success('Message deleted successfully!');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting message.');
      console.error("Error deleting message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Notifications (Contact Messages)
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="ml-2 text-gray-600 dark:text-gray-400">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center text-gray-600 dark:text-gray-400">
          <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No new contact messages or notifications at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <Card key={message.id} className="dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary-600 dark:text-primary-400 text-lg">
                  {message.subject}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">From: {message.name} ({message.email})</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Received: {new Date(message.createdAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {message.message}
                </p>
                <Dialog onOpenChange={(open) => !open && setSelectedMessage(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                      Read More
                    </Button>
                  </DialogTrigger>
                  {selectedMessage && (
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{selectedMessage.subject}</DialogTitle>
                        <DialogDescription>
                          From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                          <br />
                          Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Delete Message
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
