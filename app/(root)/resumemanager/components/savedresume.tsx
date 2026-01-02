"use client";

import ConfirmationModal from "@/components/generalComponents/confirmationModal";
import { getSavedResume, handleDeleteResume } from "@/lib/constants/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SavedResumeProps {
  onReOptimize?: (resume: any) => void;
}

const Savedresume = ({ onReOptimize }: SavedResumeProps) => {
  const router = useRouter();

  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [deleteTargetName, setDeleteTargetName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Load saved resumes
  useEffect(() => {
    const fetchData = async () => {
      await getSavedResume(); // Fetch from API or helper

      // If getSavedResume writes to localStorage, read it
      const stored = localStorage.getItem("savedResume");
      if (stored) {
        setSavedResumes(JSON.parse(stored));
      }
    };

    fetchData();
  }, []);

  // Open a saved resume
  const handleView = (index: number) => {
    const resume = savedResumes[index];

    // Store selected resume separately
    localStorage.setItem("currentResume", JSON.stringify(resume.data));

    // Track that it's an old resume
    localStorage.setItem(
      "type",
      JSON.stringify({
        type: "old",
        index: index,
      })
    );

    router.push("/resumemanager/templates1");
  };

  // Delete resume
  const handleDelete = async () => {
    const res = await handleDeleteResume(deleteTargetId);

    if (res?.success) {
      setSavedResumes((prev) =>
        prev.filter((item) => item.id !== deleteTargetId)
      );
    }

    setModalVisible(false);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setModalVisible(true);
  };

  const closeDeleteModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="w-full h-fit p-5 rounded-lg bg-white shadow-sm flex flex-col gap-5">
      {/* Confirmation modal */}
      <ConfirmationModal
        handleVisibility={closeDeleteModal}
        visibility={modalVisible}
        name={deleteTargetName}
        yes={handleDelete}
      />

      <p className="font-bold text-xl">Saved Resume</p>

      <div className="flex flex-col gap-3">
        {savedResumes.length > 0 ? (
          savedResumes.map((resume, index) => (
            <div
              key={resume.id ?? index}
              className="flex max-sm:flex-col sm:justify-between sm:items-center text-text font-bold opacity-80 border border-text/50 rounded-sm px-4 py-3 hover:border-blue-400 gap-3"
            >
              <p>{resume.file_name}</p>

              <div className="flex gap-3 text-sm sm:text-base">
                <button
                  onClick={() => handleView(index)}
                  className="hover:cursor-pointer hover:text-blue-600 transition-colors"
                >
                  View
                </button>

                <button
                  onClick={() => onReOptimize?.(resume)}
                  className="hover:cursor-pointer hover:text-blue-600 transition-colors text-blue-500 whitespace-nowrap"
                >
                  Re-Optimize
                </button>

                <button
                  onClick={() =>
                    openDeleteModal(resume.id, resume.file_name)
                  }
                  className="hover:cursor-pointer hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="opacity-60">No saved resume found.</p>
        )}
      </div>
    </div>
  );
};

export default Savedresume;
