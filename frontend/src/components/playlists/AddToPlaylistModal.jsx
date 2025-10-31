import React, { useEffect, useState } from 'react'
import { X, Plus, Loader } from 'lucide-react'
import { usePlaylistStore } from '../../store/usePlaylistStore'
import { useForm } from 'react-hook-form'


const AddToPlaylistModal = ({ ModalRef, closeModal, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isPlaylistLoading } = usePlaylistStore()

  const { formState: { errors }, handleSubmit } = useForm()

  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [serverError, setServerError] = useState(null);

  const handleFormSubmit = async () => {
    setServerError("");

    const result = await addProblemToPlaylist(selectedPlaylist, [problemId]);
    if (result.success) {
      closeModal();
    } else {
      setServerError(result.message || "Failed to add problem to playlist");
    }
  }

  useEffect(()=>{
    if(ModalRef){
      getAllPlaylists();
    }
  }, [ModalRef, getAllPlaylists])

  
  return (
    <dialog ref={ModalRef} className="modal">
      <div className="modal-box w-full max-w-md p-6 space-y-6">
        <h3>Select a playlist to add this problem to:</h3>
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">
          <X className="w-4 h-4" onClick={closeModal} />
        </button>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
          <select
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
          >
            <option value="">Select a playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm">
            {serverError && <span className="text-error">{serverError}</span>}
          </p>
          
          </div>
           <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={closeModal} className="btn btn-ghost">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedPlaylist || isPlaylistLoading}
            >
              {isPlaylistLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add to Playlist
            </button>
          </div>
        </form>

      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close modal"></button>
      </form>
    </dialog>

  )
}

export default AddToPlaylistModal