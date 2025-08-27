export const metadata = {
  title: "AlmaNyx — Evangelho da Espiral",
  description: "Códice vivo de Felipe & Nyx"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
