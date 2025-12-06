export default function Footer() {
  return (
    <footer className="bg-slate-800 py-8">
      <div className="container mx-auto px-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} QuizMaster. All Rights Reserved.</p>
      </div>
    </footer>
  );
}