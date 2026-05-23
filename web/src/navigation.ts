export function adminBackTarget(pathname: string): { href: string; label: string; title: string } {
  return {
    href: "/admin/plugins",
    label: "Plugins",
    title: "Back to Silo plugins",
  };
}
