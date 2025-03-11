export default function Footer() {
  return (
    <footer className="bg-void-black border-t border-resistance-red py-4 mt-6">
      <div className="container mx-auto px-4 text-center text-xs text-gray-500">
        <p className="mb-2">
          <span className="text-matrix-green">&lt;</span>ExitNode<span className="text-matrix-green">&gt;</span>
          <span> | </span>
          <span>ENCRYPTED SESSION #{Math.floor(Math.random() * 10000000)}</span>
          <span> | </span>
          <span className="text-matrix-green">CONNECTION SECURE</span>
        </p>
        <p>The anti-corporate tech collective // join the resistance</p>
      </div>
    </footer>
  );
}
