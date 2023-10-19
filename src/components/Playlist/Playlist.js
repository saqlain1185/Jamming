import React, { useCallback } from 'react';
import './Playlist.css';

import TrackList from '../TrackList/Tracklist';
import saveIcon from './SaveWhite.png'; 

const Playlist = (props) => {
  const handleNameChange = useCallback(
    (event) => {
      props.onNameChange(event.target.value);
    },
    [props.onNameChange]
  );

  return (
    <div className="Playlist">
      <div className="Playlist-controls">
        <input
          onChange={handleNameChange}
          value={props.playlistName || 'New Playlist'} 
        />
        <img
          src={saveIcon}
          alt="Save Icon"
          className="Playlist-save-icon"
          onClick={props.onSave}
        />
      </div>
      <div className="Playlist-tracklist">
        <TrackList tracks={props.playlistTracks} onRemove={props.onRemove} isRemoval={true} />
      </div>
    </div>
  );
};

export default Playlist;