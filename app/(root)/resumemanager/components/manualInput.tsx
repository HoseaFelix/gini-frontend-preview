'use client'

import { ResumeSchema, ResumeType } from "@/lib/schemes/resumeSchema";
import { useResumeStore } from "@/store/resumeStore";
import React, { useState } from "react";
import { toast } from "sonner";
// import { ResumeSchema, ResumeType } from "@/lib/schema/resumeSchema";


type FormDataType = {
  name: string;
  headline: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
  };
  careerObjective?: string;
  education?: { institution: string; degree: string; startYear: string; endYear: string }[];
  skills?: {
    technical?: {
      languages?: string[];
      frameworksAndLibraries?: string[];
      toolsAndBuildSystems?: string[];
      testing?: string[];
      practices?: string[];
    };
    soft?: string[];
    certifications?: string[];
  };
  awards?: string[];
  experience?: { heading: string; duration: string; achievements: string }[];
  projects?: { name: string; duration: string; achievements: string }[];
};

const ManualInput = ({isVisible, onContinue, onReturn}: {isVisible: boolean, onContinue: ()=> void, onReturn: ()=> void}) => {
  const [formData, setFormData] = useState<ResumeType>({
    name: "",
    headline: "",
    contactInfo: {
      phone: "",
      email: "",
      address: "",
      linkedIn: "",
    },
    education: [],
    skills: {
      technical: {
        languages: [],
        frameworksAndLibraries: [],
        toolsAndBuildSystems: [],
        testing: [],
        practices: [],
      },
      soft: [],
      certifications: [],
    },
    awards: [],
    careerObjective: "",
    experience: [],
    projects: [],
  });

  const setResume = useResumeStore.getState().setParsedResume;
 
  
  // Temp input states for array items
  const [educationInput, setEducationInput] = useState({ institution: "", degree: "", startYear: "", endYear: "" });
  const [skillInput, setSkillInput] = useState("");
  const [awardInput, setAwardInput] = useState("");
  const [experienceInput, setExperienceInput] = useState({ heading: "", duration: "", achievements: "" });
  const [projectInput, setProjectInput] = useState({ name: "", duration: "", achievements: "" });

  const [skillCategory, setSkillCategory] = React.useState<
  | "languages"
  | "frameworksAndLibraries"
  | "toolsAndBuildSystems"
  | "testing"
  | "practices"
  | "soft"
  | "certifications"
>("languages");

const handleChange = (path: string, value: unknown) => {
  setFormData((prev) => {
    const keys = path.split(".");

    const updated = structuredClone(prev) as FormDataType;

    let current: unknown = updated;
    keys.forEach((key, idx) => {
      if (typeof current === "object" && current !== null) {
        if (idx === keys.length - 1) {
          (current as Record<string, unknown>)[key] = value;
        } else {
          current = (current as Record<string, unknown>)[key];
        }
      }
    });

    return updated;
  });
};


  const addEducation = () => {
    if (educationInput.institution.trim()) {
      setFormData((prev) => ({
        ...prev,
        education: [...(prev.education || []), educationInput],
      }));
      setEducationInput({ institution: "", degree: "", startYear: "", endYear: "" });
    }
  };

  const addSkill = (
    category:
      | "languages"
      | "frameworksAndLibraries"
      | "toolsAndBuildSystems"
      | "testing"
      | "practices"
      | "soft"
      | "certifications"
  ) => {
    if (!skillInput.trim()) return;
  
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical:
          category !== "soft" && category !== "certifications"
            ? {
                ...prev.skills?.technical,
                [category]: [
                  ...(prev.skills?.technical?.[category] ?? []),
                  skillInput,
                ],
              }
            : prev.skills?.technical,
        soft:
          category === "soft"
            ? [...(prev.skills?.soft ?? []), skillInput]
            : prev.skills?.soft,
        certifications:
          category === "certifications"
            ? [...(prev.skills?.certifications ?? []), skillInput]
            : prev.skills?.certifications,
      },
    }));
  
    setSkillInput("");
  };
  
  
  

  const addAward = () => {
    if (awardInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        awards: [...(prev.awards || []), awardInput],
      }));
      setAwardInput("");
    }
  };

  const addExperience = () => {
    if (experienceInput.heading.trim()) {
      setFormData((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), experienceInput],
      }));
      setExperienceInput({ heading: "", duration: "", achievements: "" });
    }
  };

  const addProject = () => {
    if (projectInput.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        projects: [...(prev.projects || []), projectInput],
      }));
      setProjectInput({ name: "", duration: "", achievements: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ResumeSchema.safeParse(formData);
    if (!result.success) {
      console.error(result.error.format());
      alert("Please check your inputs.");

    } else {
        console.log("Valid data:", result.data);
        setResume(result.data)
        console.log(useResumeStore.getState().parsedResume) 
        onContinue()
        toast.success("Form submitted successfully!");
        onContinue()
    }
  };

  const handleReturn= ()=>{
    onReturn()
  }

  if(!isVisible) return;

  return (
    <div className="absolute h-full w-full z-30 bg-white shadow-md rounded-lg">
      <div className="w-full h-full p-4 flex flex-col gap">
      <form
            onSubmit={handleSubmit}
            className="resume-form overflow-y-auto grid md:grid-cols-2 p-3 h-[80%] rounded-lg w-full border border-text gap-5"
            >
            {/* Basic Info */}
            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>Full Name</p>
                <input
                type="text"
                className="w-full"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                />
            </label>

            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>Profession</p>
                <input
                type="text"
                className="w-full"
                value={formData.headline}
                onChange={(e) => handleChange("headline", e.target.value)}
                />
            </label>

            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>Email</p>
                <input
                type="email"
                className="w-full"
                value={formData.contactInfo.email}
                onChange={(e) => handleChange("contactInfo.email", e.target.value)}
                />
            </label>

            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>Phone</p>
                <input
                type="text"
                className="w-full"
                value={formData.contactInfo.phone}
                onChange={(e) => handleChange("contactInfo.phone", e.target.value)}
                />
            </label>

            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>Address</p>
                <input
                type="text"
                className="w-full"
                value={formData.contactInfo.address}
                onChange={(e) => handleChange("contactInfo.address", e.target.value)}
                />
            </label>

            <label className="resume-input col-span-1 md:col-span-1 w-full">
                <p>LinkedIn</p>
                <input
                type="text"
                className="w-full"
                value={formData.contactInfo.linkedIn}
                onChange={(e) => handleChange("contactInfo.linkedIn", e.target.value)}
                />
            </label>


          {/* Career Objective */}
          <label className="resume-input col-span-2">
            <p>Career Objective</p>
            <textarea
              className="border rounded p-2 w-full"
              value={formData.careerObjective || ""}
              onChange={(e) => handleChange("careerObjective", e.target.value)}
            />
          </label>

          {/* Education */}
          <div className="col-span-2 border-t pt-3">
            <h3 className="font-bold mb-2">Education</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Institution"
                value={educationInput.institution}
                onChange={(e) => setEducationInput({ ...educationInput, institution: e.target.value })}
              />
              <input
                placeholder="Degree"
                value={educationInput.degree}
                onChange={(e) => setEducationInput({ ...educationInput, degree: e.target.value })}
              />
              <input
                placeholder="Start Year"
                value={educationInput.startYear}
                onChange={(e) => setEducationInput({ ...educationInput, startYear: e.target.value })}
              />
              <input
                placeholder="End Year"
                value={educationInput.endYear}
                onChange={(e) => setEducationInput({ ...educationInput, endYear: e.target.value })}
              />
            </div>
            <button type="button" onClick={addEducation} className="mt-2 px-3 py-1 border rounded">
              Add Education
            </button>
            <ul className="list-disc ml-5 mt-2">
              {formData.education?.map((edu, idx) => (
                <li key={idx}>{edu.institution} - {edu.degree}</li>
              ))}
            </ul>
          </div>

    {/* Skills */}
<div className="col-span-2 border-t pt-3">
  <h3 className="font-bold mb-2">Skills</h3>

  {/* Input + category selector */}
  <div className="flex gap-2">
    <input
      value={skillInput}
      onChange={(e) => setSkillInput(e.target.value)}
      placeholder="e.g. JavaScript"
      className="border rounded px-2 py-1 flex-1"
    />
    <select
      value={skillCategory}
      onChange={(e) =>
        setSkillCategory(
          e.target.value as
            | "languages"
            | "frameworksAndLibraries"
            | "toolsAndBuildSystems"
            | "testing"
            | "practices"
            | "soft"
            | "certifications"
        )
      }
      className="border rounded px-2 py-1"
    >
      <option value="languages">Languages</option>
      <option value="frameworksAndLibraries">Frameworks & Libraries</option>
      <option value="toolsAndBuildSystems">Tools & Build Systems</option>
      <option value="testing">Testing</option>
      <option value="practices">Practices</option>
      <option value="soft">Soft Skills</option>
      <option value="certifications">Certifications</option>
    </select>
    <button
      type="button"
      onClick={() => addSkill(skillCategory)}
      className="px-3 py-1 border rounded bg-green-200"
    >
      Add
    </button>
  </div>

  {/* Display skills grouped by category */}
  <div className="mt-4 space-y-4">
    {/* Technical Skills */}
    {formData.skills?.technical && (
      <div>
        <h4 className="font-semibold mb-1">Technical</h4>
        {Object.entries(formData.skills.technical).map(([cat, skills]) => (
          skills?.length ? (
            <div key={cat} className="mb-2">
              <p className="italic text-sm capitalize">{cat}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {skills.map((skill, idx) => (
                  <span
                    key={`${cat}-${idx}`}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    )}

    {/* Soft Skills */}
    {formData.skills?.soft?.length ? (
      <div>
        <h4 className="font-semibold mb-1">Soft Skills</h4>
        <div className="flex flex-wrap gap-2">
          {formData.skills.soft.map((skill, idx) => (
            <span
              key={`soft-${idx}`}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : null}

    {/* Certifications */}
    {formData.skills?.certifications?.length ? (
      <div>
        <h4 className="font-semibold mb-1">Certifications</h4>
        <div className="flex flex-wrap gap-2">
          {formData.skills.certifications.map((skill, idx) => (
            <span
              key={`cert-${idx}`}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : null}
  </div>
</div>


          {/* Awards */}
          <div className="col-span-2 border-t pt-3">
            <h3 className="font-bold mb-2">Awards</h3>
            <div className="flex gap-2">
              <input value={awardInput} onChange={(e) => setAwardInput(e.target.value)} placeholder="Award title" />
              <button type="button" onClick={addAward} className="px-3 py-1 border rounded">
                Add
              </button>
            </div>
            <ul className="list-disc ml-5 mt-2">
              {formData.awards?.map((award, idx) => (
                <li key={idx}>{award}</li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div className="col-span-2 border-t pt-3">
            <h3 className="font-bold mb-2">Experience</h3>
            <div className="grid grid-cols-3 gap-2">
              <input
                placeholder="Heading"
                value={experienceInput.heading}
                onChange={(e) => setExperienceInput({ ...experienceInput, heading: e.target.value })}
              />
              <input
                placeholder="Duration"
                value={experienceInput.duration}
                onChange={(e) => setExperienceInput({ ...experienceInput, duration: e.target.value })}
              />
              <input
                placeholder="Achievements"
                value={experienceInput.achievements}
                onChange={(e) => setExperienceInput({ ...experienceInput, achievements: e.target.value })}
              />
            </div>
            <button type="button" onClick={addExperience} className="mt-2 px-3 py-1 border rounded">
              Add Experience
            </button>
            <ul className="list-disc ml-5 mt-2">
              {formData.experience?.map((exp, idx) => (
                <li key={idx}>{exp.heading} - {exp.duration}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="col-span-2 border-t pt-3">
            <h3 className="font-bold mb-2">Projects</h3>
            <div className="grid grid-cols-3 gap-2">
              <input
                placeholder="Project Name"
                value={projectInput.name}
                onChange={(e) => setProjectInput({ ...projectInput, name: e.target.value })}
              />
              <input
                placeholder="Duration"
                value={projectInput.duration}
                onChange={(e) => setProjectInput({ ...projectInput, duration: e.target.value })}
              />
              <input
                placeholder="Achievements"
                value={projectInput.achievements}
                onChange={(e) => setProjectInput({ ...projectInput, achievements: e.target.value })}
              />
            </div>
            <button type="button" onClick={addProject} className="mt-2 px-3 py-1 border rounded">
              Add Project
            </button>
            <ul className="list-disc ml-5 mt-2">
              {formData.projects?.map((proj, idx) => (
                <li key={idx}>{proj.name} - {proj.duration}</li>
              ))}
            </ul>
          </div>
      </form>

        {/* Buttons */}
        <div 
        onClick={handleReturn}
        className="h-max flex gap-3 w-full justify-end mt-3">
          <button type="button" className="hover:cursor-pointer px-4 py-1 rounded-sm border border-foreground text-foreground font-bold">
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-foreground rounded-sm px-3 hover:cursor-pointer font-bold py-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualInput;
