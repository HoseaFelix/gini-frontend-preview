import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const supportedLanguages = [
  "Arabic", "Bengali", "Bulgarian", "Chinese (Simplified)", "Chinese (Traditional)", "Croatian",
  "Czech", "Danish", "Dutch", "English", "Estonian", "Farsi", "Finnish", "French", "German",
  "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese",
  "Kannada", "Korean", "Latvian", "Lithuanian", "Malayalam", "Marathi", "Norwegian", "Polish",
  "Portuguese", "Romanian", "Russian", "Serbian", "Slovak", "Slovenian", "Spanish", "Swahili",
  "Swedish", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Igbo", "yoruba", "hausa"
];


export default function LanguageDropdown({ setLanguage }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("English");

  return (
    <div className="flex justify-between gap-2 flex-wrap">
      <p className="font-bold text-xl">Add job description</p>
      
      <div className="w-[250px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {value || "Select language"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandGroup>
                {supportedLanguages.map((lang) => (
                  <CommandItem
                    key={lang}
                    value={lang}
                    onSelect={() => {
                      setValue(lang);
                      setLanguage(lang);
                      setOpen(false);
                    }}
                  >
                    {lang}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
