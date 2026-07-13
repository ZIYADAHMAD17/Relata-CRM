import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Upload, FolderOpen, File, FileText, Image, MoreHorizontal, Download } from 'lucide-react';
import { getDocuments, createDocument } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const folderColors = [
  'from-primary/20 to-primary/5',
  'from-secondary/20 to-secondary/5',
  'from-warning/20 to-warning/5',
  'from-success/20 to-success/5',
];

const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'file' });
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDoc = {
        ...formData,
        size: formData.type === 'file' ? (Math.random() * 5).toFixed(1) + ' MB' : '0 KB',
      };
      await createDocument(newDoc);
      setIsDialogOpen(false);
      setFormData({ name: '', type: 'file' });
      fetchDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const folders = documents.filter(d => d.type === 'folder');
  const files = documents.filter(d => d.type === 'file');

  return (
    <div className="flex flex-col gap-8 pb-20 md:pb-0 max-w-6xl mx-auto h-full">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Store, organize and preview all your important files.</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ name: '', type: 'file' })} variant="outline" className="rounded-full bg-card/50 backdrop-blur-sm shadow-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            {!isEmployee && (
              <DialogTrigger asChild>
                <Button onClick={() => setFormData({ name: '', type: 'folder' })} className="bg-primary text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  New Folder
                </Button>
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{formData.type === 'file' ? 'Upload New File' : 'Create New Folder'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDocument} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">{formData.type === 'file' ? 'File Name (Optional)' : 'Folder Name'}</Label>
                  <Input id="name" required={formData.type !== 'file'} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={formData.type === 'file' ? "Proposal.pdf" : "Contracts"} />
                </div>
                {formData.type === 'file' && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="file_upload">Select File</Label>
                    <input
                      id="file_upload"
                      type="file"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({...formData, name: e.target.files[0].name});
                        }
                      }}
                    />
                  </div>
                )}
                <Button type="submit" className="mt-4">{formData.type === 'file' ? 'Upload' : 'Create'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9 bg-card/50 backdrop-blur-sm border-border/50 rounded-full" />
        </div>
      </motion.div>

      {loading ? (
        <div>Loading documents...</div>
      ) : (
        <>
          {/* Folders Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {folders.map((folder, i) => (
                <motion.div key={folder.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.07 }}>
                  <div className={`glass-panel p-5 cursor-pointer hover:border-primary/30 hover:-translate-y-1 transition-all group relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${folderColors[i % folderColors.length]} opacity-50 group-hover:opacity-80 transition-opacity`} />
                    <div className="relative z-10 flex flex-col gap-4">
                      <FolderOpen className="w-8 h-8 text-primary/70" />
                      <div>
                        <p className="font-semibold text-sm">{folder.name}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {folders.length === 0 && (
                <div className="col-span-full text-muted-foreground">No folders yet.</div>
              )}
            </div>
          </div>

          {/* Recent Files */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Files</h2>
            <div className="glass-panel overflow-hidden">
              <div className="flex flex-col divide-y divide-border/50">
                {files.map((file, i) => {
                  const isPdf = file.name.toLowerCase().endsWith('.pdf');
                  const isImg = file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
                  const IconComponent = isPdf ? FileText : isImg ? Image : File;

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-danger/10 text-danger' : isImg ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{file.size}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => alert("Downloading document...")} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert("Share clicked")}>Share</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("Rename clicked")}>Rename</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("Delete clicked")} className="text-danger">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  )
                })}
                {files.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No files uploaded yet.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Documents;
