import { Cellcontent } from "../types/spreadsheet";
import { useState, useEffect, KeyboardEvent } from "react";

interface Props {
  content: Cellcontent;
  onChange: (updated: Cellcontent) => void;
}

export default function Cell({ content: initialContent, onChange }: Props) {
  const [editing, setEditing] = useState<boolean>(false);
  const [content, setContent] = useState<Cellcontent>(initialContent);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Escape"].includes(event.key)) {
      setEditing(false);
      setContent(initialContent);
    }
    if (event.key === "Enter") {
      onChange(content);
    }
  };

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const evaluateFormula = (exp: string) => {
    const sanitized = exp.slice(1).replace(/[^\=\+\-\*%/0-9]/g, "");
    // 正規表現
    //   /.../   /から/までの間
    //   /.../g  連続してマッチさせる
    return eval(sanitized);
  };

  return (
    <td onClick={() => setEditing(!editing)}>
      {editing ? (
        <input
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={onKeyDown}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      ) : content.toString().startsWith("=") ? (
        evaluateFormula(content.toString())
      ) : (
        content
      )}
    </td>
  );
}
