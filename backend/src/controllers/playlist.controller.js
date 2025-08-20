import { db } from "../lib/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

export const getAllPlaylistDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "playlist fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlist", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      return res.status(404).json({ error: "playlist not found" });
    }
    res.status(200).json({
      success: true,
      message: "playlist details fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetch playlist details", error);
    res.status(500).json({ error: "Error fetch playlist details" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemId" });
    }

    const problemsInPlaylist = await db.problemsInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });
    res.status(201).json({
      success: true,
      message: "Problem added to playlist",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problem in playlist", error);
    res.status(500).json({ error: "Error adding problem in playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    res.status(200).json({
      success: true,
      message:`remove playlist`,
      deletePlaylist,
    });
  } catch (error) {
    console.error("Error deleting problem from playlist", error);
    res.status(500).json({ error: "Error deleting problem from playlist" });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problem" });
    }

    const removeProblem = await db.problemsInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "problem removed from playlist",
      removeProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist", error);
    res.status(500).json({ error: "Error removing problem from playlist" });
  }
};
