import { FC, useState } from "react";
import { IoMdAdd, IoMdTrash, IoMdCreate } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INotebook } from "@/types/notebookType";

interface INotebookProps {
  notebooks: INotebook[];
  addNotebook: (title: string) => void;
  deleteNotebook: (notebookId: string) => void;
  updateNotebook: (notebookId: string, title: string, notes: string[]) => void;
}

const Notebook: FC<INotebookProps> = ({
  notebooks,
  addNotebook,
  deleteNotebook,
  updateNotebook,
}) => {
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [showNewNotebookInput, setShowNewNotebookInput] = useState(false);

  const addNewNotebook = () => {
    if (!newNotebookTitle.trim()) return;
    addNotebook(newNotebookTitle);
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto text-white">
      {/* Header */}
      <div className="flex justify-center items-center">
        <Button
          variant="v1"
          onClick={() => setShowNewNotebookInput(!showNewNotebookInput)}
        >
          <IoMdAdd className="mr-2" />
          Add Notebook
        </Button>
      </div>

      {/* New Notebook Input */}
      {showNewNotebookInput && (
        <div className="flex gap-4 items-center bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-xl">
          <Input
            className="bg-transparent border border-white/20 text-white placeholder:text-white/40"
            placeholder="Enter notebook title"
            value={newNotebookTitle}
            onChange={(e) => setNewNotebookTitle(e.target.value)}
          />
          <Button onClick={addNewNotebook} disabled={!newNotebookTitle.trim()}>
            Save
          </Button>
        </div>
      )}

      {/* Notebooks */}
      {notebooks.map((notebook) => (
        <NotebookItem
          key={notebook._id}
          deleteNotebook={deleteNotebook}
          updateNotebook={updateNotebook}
          {...notebook}
        />
      ))}
    </div>
  );
};

interface INotebookItemProps {
  deleteNotebook: (notebookId: string) => void;
  updateNotebook: (notebookId: string, title: string, notes: string[]) => void;
  title: string;
  notes: string[];
  _id: string;
}

const NotebookItem: FC<INotebookItemProps> = ({
  deleteNotebook,
  notes,
  _id,
  title,
  updateNotebook,
}) => {
  const titleEdit = (updatedTitle: string) => {
    updateNotebook(_id, updatedTitle, notes);
  };

  const deletebook = () => {
    deleteNotebook(_id);
  };

  const addNote = (note: string) => {
    updateNotebook(_id, title, [...notes, note]);
  };

  const deleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    updateNotebook(_id, title, updatedNotes);
  };

  const updateNote = (index: number, updatedNote: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = updatedNote;
    updateNotebook(_id, title, updatedNotes);
  };

  console.log(notes, _id);

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-xl space-y-4">
      <EditableTitle title={title} onUpdate={titleEdit} onDelete={deletebook} />

      {/* Note Editor */}
      <NoteEditor onSave={addNote} />

      {/* Notes */}
      <div className="space-y-2">
        {notes.map((note, index) => (
          <NoteItem
            key={index + note}
            note={note}
            onDelete={() => deleteNote(index)}
            onUpdate={(val) => updateNote(index, val)}
          />
        ))}
      </div>
    </div>
  );
};

// Editable Title Component
const EditableTitle = ({
  title,
  onUpdate,
  onDelete,
}: {
  title: string;
  onUpdate: (val: string) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  const save = () => {
    if (!value.trim()) return;
    onUpdate(value.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {isEditing ? (
        <div className="flex gap-2 w-full">
          <Input
            className="bg-transparent border border-white/20 text-white"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={save}>Save</Button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => setIsEditing(true)}
            >
              <IoMdCreate className="mr-1" />
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <IoMdTrash />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// Note Editor
const NoteEditor = ({ onSave }: { onSave: (note: string) => void }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");

  const save = () => {
    if (!value.trim()) return;
    onSave(value.trim());
    setValue("");
    setShowInput(false);
  };

  return showInput ? (
    <div className="flex gap-2">
      <Input
        className="bg-transparent border border-white/20 text-white"
        placeholder="Write your note"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={save}>Save</Button>
    </div>
  ) : (
    <Button variant="v2" className="text-sm" onClick={() => setShowInput(true)}>
      <IoMdAdd className="mr-2" />
      Add Note
    </Button>
  );
};

// Note Item
const NoteItem = ({
  note,
  onDelete,
  onUpdate,
}: {
  note: string;
  onDelete: () => void;
  onUpdate: (val: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note);

  const save = () => {
    if (!value.trim()) return;
    onUpdate(value.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            className="bg-transparent border border-white/20 text-white"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={save}>Save</Button>
        </>
      ) : (
        <>
          <p className="flex-1 text-sm">{note}</p>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => setIsEditing(true)}
          >
            <IoMdCreate />
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        className="text-xs text-red-400 hover:text-red-600"
        onClick={onDelete}
      >
        <IoMdTrash />
      </Button>
    </div>
  );
};

export default Notebook;
