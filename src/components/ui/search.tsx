/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { Input } from "./input";
// import { Button } from "./button";
// import { SearchIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";
import axios from "axios";
import Price from "./price";

const Search = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [result, setResult] = useState<any[]>([]);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setResult(data.products);
      } catch (err: unknown) {
        console.error("Error fetching search results", err);
        setResult([]);
      }
    };

    fetchResult();
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      {/* <Input type="text" placeholder="Looking for item..." className="w-72" /> */}
      <Command className="absolute rounded-lg border shadow-md md:min-w-[400px] h-auto right-0 top-[-23px]">
        <CommandInput
          placeholder="Looking for item..."
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isFocused && (
          <CommandList>
            {result.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Products">
                {result.map((p) => (
                  <CommandItem key={p.id} onClick={() => alert("adasda")}>
                    <span>{p.name}</span> {/* Hiển thị tên sản phẩm */}
                    <CommandShortcut>
                      <Price price={p.price} />$
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
      {/* <Button className="border-none" variant="outline" size="icon">
        <SearchIcon />
      </Button> */}
    </div>
  );
};

export default Search;
