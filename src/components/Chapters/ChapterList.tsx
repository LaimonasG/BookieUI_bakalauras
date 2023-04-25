import React from 'react';
import { IChapters } from '../../Interfaces';
import './ChapterList.css';

interface Props {
  chapters: IChapters[] | null;
}

function ChapterList(props: Props) {
  const { chapters } = props;

  if (!chapters) {
    return <div>No chapters added yet.</div>;
  }

  return (
    <div className="chapter-list">
      {chapters.map((chapter, index) => (
        <div key={index} className="chapter-panel">
          <h2 className="chapter-title">{chapter.Name}</h2>
          <p className="chapter-content">{chapter.Content}</p>
        </div>
      ))}
    </div>
  );
}

export default ChapterList;