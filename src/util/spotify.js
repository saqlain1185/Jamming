const clientId = 'f2cda7a767f44beea38cec9c840dd7cd';
const redirectUri = 'http://localhost:3000/';
let accessToken = '';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1];
            const expiresIn = Number(urlExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.tracks && data.tracks.items) {
                    return data.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists.map(artist => artist.name).join(', '),
                        album: track.album.name,
                        uri: track.uri
                    }));
                } else {
                    return [];
                }
            });
    },

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return Promise.resolve();
        }

        const accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ name: name }),
                });
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: trackURIs }),
                });
            });
    },

    getUserPlaylists() {
        const accessToken = this.getAccessToken();

        return fetch('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then(response => response.json())
            .then(data => {
                const playlists = data.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    tracks: [], // Initialize tracks property for each playlist
                }));

                const playlistPromises = playlists.map(playlist => {
                    return fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    })
                        .then(response => response.json())
                        .then(tracksData => {
                            playlist.tracks = tracksData.items.map(item => ({
                                id: item.track.id,
                                name: item.track.name,
                                artist: item.track.artists.map(artist => artist.name).join(', '),
                                album: item.track.album.name,
                                uri: item.track.uri
                            }));
                            return playlist;
                        });
                });

                return Promise.all(playlistPromises);
            });
    },
};

export { Spotify };