import { useState, useEffect } from "react";
import "./BlogEditor.css";
import { getProfile } from "../../services/userService";
import { createBlog } from "../../services/blogService";
import { FiArrowLeft } from "react-icons/fi";

const BlogEditor = ({ onSubmit, onBack }) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");

  // Fetch user (only if needed later, currently not used in UI)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getProfile();
        // user data removed because it was not used anywhere
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();
  }, []);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || tags.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const newBlog = {
        title,
        content,
        tags: tags.map((tag) =>
          tag.startsWith("#") ? tag : `#${tag}`
        ),
        image: imageUrl,
      };

      const savedBlog = await createBlog(newBlog);

      alert("Blog published successfully!");

      setTitle("");
      setImageUrl("");
      setTags([]);
      setTagInput("");
      setContent("");

      if (onSubmit) {
        onSubmit(savedBlog);
      }
    } catch (err) {
      console.error("Error saving blog:", err.response || err);
    }
  };

  return (
    <div className="create-blog-wrapper">
      <button
        className="back-button"
        onClick={() => {
          onBack();
          window.location.reload();
        }}
      >
        <FiArrowLeft />
      </button>

      <h3 style={{ fontSize: "25px", color: "white" }}>
        Create a New Blog
      </h3>

      <form className="create-blog-form" onSubmit={handleSubmit}>
        <label>
          Title *
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            required
          />
        </label>

        <label>
          Image URL
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </label>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="image-preview"
          />
        )}

        <label>
          Tags *
          <div className="tags-input-wrapper">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Write 1 relevant tag then enter"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), handleAddTag())
              }
            />
            <button type="button" onClick={handleAddTag}>
              Add Tag
            </button>
          </div>

          <div className="tags-preview">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </label>

        <label>
          Content *
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog here..."
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default BlogEditor;