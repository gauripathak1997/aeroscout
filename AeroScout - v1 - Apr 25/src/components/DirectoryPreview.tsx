import { getDirectoryPreview } from "@/api/aircraft";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface DirectoryPreviewProps {
  operatorFilter?: string;
  footerText?: string;
}

export function DirectoryPreview({ operatorFilter, footerText }: DirectoryPreviewProps = {}) {
  const items = getDirectoryPreview(operatorFilter);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs">Registration</th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs">Variant</th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs">YOM</th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-xs">Operator</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-2.5 text-xs">Status</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No aircraft found for this operator.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.aircraft_id}
                  onClick={() => navigate(`/aircraft/${item.aircraft_id}`)}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{item.registration}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.variant}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{item.yom}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.operator}</td>
                  <td className="px-4 py-3 text-right">
                    {item.on_market && (
                      <span className="text-[10px] font-medium bg-primary/8 text-primary rounded-full px-2 py-0.5">On Market</span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        {footerText ?? "A320s loaded into the database · B737 and widebodies coming soon"}
      </p>
    </div>
  );
}
