import { useEffect, useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hook/useAuth";
import { userService } from "../../services/userServices";
import type { UrlData } from "../../types/IUser";
import { toast, Toaster } from "react-hot-toast";
import { notifyError, notifySuccess } from "../../utils/notify";
import { confirmToast } from "../../components/confirmToast";

const Dashboard = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const { user } = useAuth();

  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) return "Unknown Date";
    return dateObj.toISOString().split("T")[0];
  };

  const handleOpen = async (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      const data = await userService.getUrls();
      const formatted = data.map((url: any) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        createdAt: formatDate(url.createdAt),
        title: "Saved Link",
      }));
      setUrls(formatted);
    } catch (error) {
      console.error("Failed to refresh URLs after redirect");
    }
  };

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      try {
        const data = await userService.getUrls();
        const formatted = data.map((url: any) => ({
          id: url._id,
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          clicks: url.clicks,
          createdAt: formatDate(url.createdAt),
          title: "Saved Link",
        }));
        setUrls(formatted);
      } catch (error) {
        console.error("Error loading URLs:", error);
        setError("Failed to load URLs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newUrl) return;

    setLoading(true);
    try {
      const response = await userService.shorten(newUrl);
      console.log(response, "for ri");
      const newEntry: UrlData = {
        id: response.data._id || Date.now().toString(),
        originalUrl: response.data.originalUrl,
        shortUrl: response.data.shortUrl,
        clicks: 0,
        createdAt: formatDate(response.data.createdAt),
        title: "New Link",
      };

      setUrls([newEntry, ...urls]);
      setNewUrl("");
    } catch (err: any) {
      notifyError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
const handleDelete = (id: string) => {
  confirmToast(async () => {
    try {
      await userService.deleteUrl(id);
      setUrls((prev) => prev.filter((url) => url.id !== id));
      notifySuccess("URL deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      notifyError("Failed to delete URL");
    }
  });
};

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!", {
      style: {
        background: "#494E6B",
        color: "#fff",
        border: "1px solid #98878F",
        fontSize: "14px",
      },
      iconTheme: {
        primary: "#98878F",
        secondary: "#2a2d42",
      },
    });
  };

  const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0);

  const filteredUrls = urls.filter((url) =>
    url.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const displayedUrls = filteredUrls.slice(0, visibleCount);

  const handleToggleView = () => {
    if (visibleCount >= filteredUrls.length) {
      setVisibleCount(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setVisibleCount((prev) => prev + 5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#494E6B] via-[#3d4159] to-[#2a2d42] text-white">
      <Navbar />
      <Toaster position="top-right" />
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Welcome Back {user?.name}</h2>
        <p className="text-[#98878F] mb-6">
          Manage your shortened URLs and track performance.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-black/30 backdrop-blur-md shadow-lg border border-[#98878F]/20">
            <p className="text-sm text-[#98878F]">Total Links</p>
            <h3 className="text-2xl font-semibold">{urls.length}</h3>
          </div>
          <div className="p-4 rounded-xl bg-black/30 backdrop-blur-md shadow-lg border border-[#98878F]/20">
            <p className="text-sm text-[#98878F]">Total Clicks</p>
            <h3 className="text-2xl font-semibold">{totalClicks}</h3>
          </div>
        </div>

        <form onSubmit={handleShorten} className="flex gap-4 mb-8">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/long-url"
            required
            className="flex-1 px-4 py-3 bg-[#494E6B]/50 border border-[#98878F]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98878F] placeholder:text-[#98878F]/60 text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#494E6B] to-[#98878F] hover:from-[#3d4159] hover:to-[#847379] px-6 py-3 rounded-lg font-medium text-white"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </form>

        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-[#494E6B]/40 border border-[#98878F]/20 rounded-lg placeholder:text-[#98878F]/50 text-white"
          disabled={loading}
        />

        <div className="space-y-4">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {displayedUrls.length === 0 && !loading && (
            <p className="text-[#98878F]/70 text-center mt-12">
              No shortened URLs yet. Add one above!
            </p>
          )}
          {displayedUrls.map((url) => (
            <div
              key={url.id}
              className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-[#98878F]/20 hover:border-[#98878F]/50 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <p className="text-sm text-[#98878F] mb-1">
                    {url.originalUrl}
                  </p>
                  <div className="font-mono text-lg text-[#b8a8af]">
                    {url.shortUrl}
                  </div>
                  <div className="text-xs text-[#98878F]/70 mt-1">
                    Created on {url.createdAt} | {url.clicks} clicks
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => copyToClipboard(url.shortUrl)}
                    className="px-3 py-1 text-sm rounded-lg bg-[#98878F]/20 hover:bg-[#98878F]/40 text-white flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={() => handleOpen(url.shortUrl)}
                    className="px-3 py-1 text-sm rounded-lg bg-[#98878F]/20 hover:bg-[#98878F]/40 text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" /> Open
                  </button>
                  <button
                    onClick={() => handleDelete(url.id)}
                    className="px-3 py-1 text-sm rounded-lg bg-red-500/30 hover:bg-red-600/50 text-white flex items-center gap-1"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUrls.length > 5 && (
          <div className="text-center mt-6">
            <button
              onClick={handleToggleView}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#494E6B] to-[#98878F] hover:from-[#3d4159] hover:to-[#847379] text-white font-semibold tracking-wide shadow-lg transition-transform transform hover:scale-105"
            >
              {visibleCount >= filteredUrls.length ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
