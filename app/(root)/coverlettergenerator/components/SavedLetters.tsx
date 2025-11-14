"use client";

import ConfirmationModal from "@/components/generalComponents/confirmationModal";
import { getSavedCoverLetter, handleDeleteCoverLetter } from "@/lib/constants/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SavedLetters = () => {
  const router = useRouter();

  const [savedLetters, setSavedLetters] = useState<any[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [deleteTargetName, setDeleteTargetName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Load cover letters
  useEffect(() => {
    const fetchData = async () => {
      await getSavedCoverLetter(); // populates localStorage

      const stored = localStorage.getItem("savedCoverLetters");
      if (stored) {
        setSavedLetters(JSON.parse(stored));
      }
    };

    fetchData();
  }, []);

  // Open a cover letter
  const handleView = (index: number) => {
    localStorage.setItem(
      "typeCoverLetter",
      JSON.stringify({
        type: "old",
        index,
      })
    );

    router.push("/coverlettergenerator/covertemplate1");
  };

  // Delete a cover letter
  const handleDelete = async () => {
    const res = await handleDeleteCoverLetter(deleteTargetId);

    if (res?.success) {
      setSavedLetters((prev) =>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        handleVisibility={closeDeleteModal}
        visibility={modalVisible}
        name={deleteTargetName}
        yes={handleDelete}
      />

      <p className="font-bold text-xl">Saved Cover Letters</p>

      <div className="flex flex-col gap-3">
        {savedLetters.length > 0 ? (
          savedLetters.map((letter, index) => (
            <div
              key={letter.id ?? index}
              className="flex justify-between items-center text-text font-bold opacity-80 border border-text/50 rounded-sm px-4 py-3 hover:border-blue-400"
            >
              <p>{letter.title}</p>

              <div className="flex gap-3">
                <p
                  className="hover:cursor-pointer"
                  onClick={() => handleView(index)}
                >
                  View
                </p>

                <p
                  className="hover:cursor-pointer"
                  onClick={() =>
                    openDeleteModal(letter.id, letter.title)
                  }
                >
                  Delete
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="opacity-60">No saved cover letters found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedLetters;
