import { toast } from "react-hot-toast";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function confirmToast(action: () => Promise<void>) {
  toast.custom((t) => {
    const handleConfirm = async () => {
      toast.dismiss(t.id); 

      await sleep(100); 

      await action(); 
    };

    return (
      <div className="bg-[#2a2d42] text-white p-5 rounded-xl border border-[#98878F] shadow-lg max-w-sm w-full mx-auto">
        <p className="text-sm mb-4">Are you sure you want to delete this URL?</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 rounded bg-[#494E6B] hover:bg-[#3d4159] transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-[#98878F] hover:bg-[#847379] text-black font-semibold transition"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }, {
    position: "top-center",
    duration: Infinity,
  });
}
