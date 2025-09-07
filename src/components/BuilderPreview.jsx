export default function BuilderPreview({ item }) {
  return (
    <div className="p-6">
      {!item ? (
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          <h3 className="text-xl font-semibold mb-3">Vorschau</h3>
          <p>
            Die generierten Komponenten und Seiten erscheinen hier. Stellen Sie
            Fragen oder geben Sie Anweisungen im Chat auf der linken Seite.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white/60 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
          <div className="prose max-w-full text-black bg-white p-4 rounded">
            <pre className="whitespace-pre-wrap text-sm">{item.code}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
