
import React from 'react';
import { Card, Button } from './commonComponents';
import type { Media } from './types';

interface MediaLibraryViewProps {
    media: Media[];
    onDelete: (m: Media) => void;
    onUpload: () => void;
}

const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({ media, onDelete, onUpload }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Media Library</h2>
            <Button onClick={onUpload}>Upload Media</Button>
        </div>
        <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {media.map(item => (
                    <div key={item.id} className="relative group border border-slate-700 rounded-lg overflow-hidden">
                        {item.type === 'image' ? (
                            <img src={item.url} alt={item.caption} className="w-full h-32 object-cover" />
                        ) : (
                            <div className="w-full h-32 bg-slate-700 flex items-center justify-center text-sky-400 font-bold text-2xl">PDF</div>
                        )}
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="danger" onClick={() => onDelete(item)}>Delete</Button>
                        </div>
                        <p className="text-xs bg-slate-800/80 p-1 truncate absolute bottom-0 w-full">{item.caption}</p>
                    </div>
                ))}
            </div>
            {media.length === 0 && <p className="text-center text-slate-400 py-8">No media found. Upload something!</p>}
        </Card>
    </div>
);

export default MediaLibraryView;
