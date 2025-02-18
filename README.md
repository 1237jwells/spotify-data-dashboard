# Spotify Next.js App

This Next.js application integrates with the Spotify Web API to provide an immersive music experience. It offers features such as Spotify authentication, real-time playback controls (for Premium users), a searchable catalog for top artists (sorted by follower count), and a trending sidebar that shows the top trending artists and global top tracks.

## Features

- **Spotify Authentication**  
  Log in using your Spotify account. The app retrieves and stores your access token, allowing you to control playback via the Web Playback SDK.

- **Playback Controls**  
  Play, pause, and toggle tracks directly in the app. Only available for Spotify Premium users.

- **Search Top Artists**  
  Search for artists and view the top 10 results sorted by follower count. This uses our custom API endpoint that leverages Spotify's search API.

- **Trending Sidebar**  
  See trending data including the top artists (sorted by follower count) and global top tracks, fetched dynamically from Spotify endpoints.

- **Detailed Views**  
  Explore detailed information for tracks, artists, and albums with dedicated pages and components.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- A Spotify Developer Account. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) to obtain your API credentials.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Spotify credentials:

   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
   NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- **app/**  
  Contains Next.js pages (e.g., search page, main page), layout, and dynamic routes for API endpoints.

- **app/api/spotify/**  
  API routes that interface with Spotify (e.g., `/top-artists`, `/trending`, `/artist/[id]/top-tracks`).

- **lib/spotify.ts**  
  Helper functions that abstract calls to Spotify's API. For example, the `getTop10ArtistsByFollowers` function fetches and sorts artists based on follower count.

- **components/**  
  UI components including `TrendingSidebar`, playback controls, result cards, and others.  
  - **SidebarCards.tsx** renders individual cards for artists and tracks.
  
- **types/spotify.ts**  
  Contains TypeScript type definitions for Spotify data objects (Artist, Track, Album, etc.).

## Usage

- **Searching for Top Artists**  
  On the search page, enter a query to look for artists. The app will display the top 10 artists sorted by their follower count.

- **Trending Sidebar**  
  The sidebar displays real-time trending data including top artists (by follower count) and the global top tracks from a featured playlist.

- **Playback**  
  Once logged in with a Spotify Premium account, you can play tracks directly from the app.

## Contributing

Contributions, bug reports, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the MIT License.
