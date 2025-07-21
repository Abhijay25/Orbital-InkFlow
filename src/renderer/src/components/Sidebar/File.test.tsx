import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import File from "./File";

beforeAll(() => {
  window.electronAPI = {
    saveFile: jest.fn().mockResolvedValue(undefined),
    saveContentToFile: jest.fn().mockResolvedValue(undefined),
    getLatestContentByFile: jest.fn().mockResolvedValue(null),
    getFiles: jest.fn().mockResolvedValue([]),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    transcription: {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      onUpdate: jest.fn(),
      removeUpdateListener: jest.fn(),
      getTranscript: jest.fn().mockReturnValue(""),
    },
  };
});

test("Calls deleteFile and onSave when right click file", async () => {
  const onSave = jest.fn();
  const editorRef = { current: null };
  render(
    <div data-testid="test-note">
      <File
        id={crypto.randomUUID()}
        textName="Test Note"
        editorRef={editorRef}
        onSave={onSave}
        fileItems={[]}
        setFileItems={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>,
  );

  // Find the button that opens the menu
  const menuButton = screen.getByRole("button", { name: /test note/i });

  // Simulate right-click to open the menu
  fireEvent.contextMenu(menuButton);

  // Wait for the delete button to appear in the menu
  const deleteButton = await screen.findByTestId("delete-test-button");
  await userEvent.click(deleteButton);

  await waitFor(() => {
    expect(window.electronAPI.deleteFile).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalled();
  });
});
