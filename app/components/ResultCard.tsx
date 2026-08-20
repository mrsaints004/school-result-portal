interface Subject {
  name: string;
  score: number;
  grade: string;
}

interface ResultCardProps {
  studentName?: string;
  className: string;
  session: string;
  term: string;
  subjects: Subject[];
}

export default function ResultCard({ studentName, className: cls, session, term, subjects }: ResultCardProps) {
  const average = subjects.length > 0
    ? (subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length).toFixed(1)
    : "0.0";

  const gradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-700";
      case "B": return "bg-blue-100 text-blue-700";
      case "C": return "bg-yellow-100 text-yellow-700";
      default: return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {studentName ?? cls}
        </h2>
        <p className="text-sm text-gray-500">
          {studentName ? `${cls} | ` : ""}{session} | {term} Term
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-600">
            <th className="py-2">Subject</th>
            <th className="py-2">Score</th>
            <th className="py-2">Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2">{subject.name}</td>
              <td className="py-2">{subject.score}</td>
              <td className="py-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${gradeColor(subject.grade)}`}>
                  {subject.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-sm text-gray-500 text-right">
        Average: {average}
      </div>
    </div>
  );
}
