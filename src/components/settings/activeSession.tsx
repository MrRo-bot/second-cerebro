"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, formatDistanceToNowStrict, isPast } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  listSessions,
  revokeSession,
  revokeOtherSessions,
  useSession,
} from "@/lib/auth-client";
import { renderToast, userAgentParser } from "@/lib/utils";

import { SessionType } from "@/types/user";
import { TrashIcon, WarningDiamondIcon } from "@phosphor-icons/react";

type ActiveSessionProps = {
  /** Called when the dialog is dismissed (X, overlay click, Esc, Close button). */
  onClose: () => void;
};

const toDate = (v: Date | string | number) =>
  v instanceof Date ? v : new Date(v);

const TimeRow = ({
  label,
  value,
  isExpiry = false,
}: {
  label: string;
  value: Date | string | number;
  isExpiry?: boolean;
}) => {
  const d = toDate(value);
  const valid = !Number.isNaN(d.getTime());
  const expired = isExpiry && valid && isPast(d);
  const relative = valid
    ? formatDistanceToNowStrict(d, { addSuffix: true })
    : "—";

  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-slate-400 dark:text-slate-300 font-heading">
        {label}
      </span>
      <time
        dateTime={valid ? d.toISOString() : undefined}
        title={valid ? format(d, "PPpp") : undefined}
        className={expired ? "text-destructive" : "text-slate-600"}
      >
        {expired ? `Expired ${relative}` : relative}
      </time>
    </div>
  );
};

export const ActiveSessions = ({ onClose }: ActiveSessionProps) => {
  const { data: mySession } = useSession();
  const router = useRouter();

  const [sessionsList, setSessionsList] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);

  // getting sessions list
  useEffect(() => {
    let active = true;

    const fetchSessions = async () => {
      setLoading(true);
      const { data: sessions, error } = await listSessions();
      if (!active) return;

      if (sessions) {
        setSessionsList(sessions);
      } else {
        renderToast({
          status: "error",
          message: `${error?.code ?? "Error"} ${error?.status ?? ""}: ${
            error?.message ?? "Failed to load sessions"
          }`,
        });
      }
      setLoading(false);
    };

    const timeout = setTimeout(fetchSessions, 300);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleRevokeOne = async (token: string) => {
    if (!token) return;
    setRevokingToken(token);

    const { error } = await revokeSession({ token });
    setRevokingToken(null);

    if (error) {
      renderToast({
        status: "error",
        message: error.message || "Failed to revoke session",
      });
      return;
    }

    setSessionsList((prev) => prev.filter((p) => p.token !== token));
    renderToast({
      status: "success",
      message: "Session revoked",
    });
    router.refresh();
  };

  const handleRevokeRest = async () => {
    setRevokingOthers(true);
    const { error } = await revokeOtherSessions();
    setRevokingOthers(false);

    if (error) {
      renderToast({
        status: "error",
        message: error.message || "Failed to revoke other sessions",
      });
      return;
    }

    setSessionsList((prev) =>
      prev.filter((s) => mySession?.session?.id === s.id),
    );
    renderToast({
      status: "success",
      message: "Ended all other sessions",
    });
    router.refresh();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Active Sessions</DialogTitle>
          <DialogDescription>
            Below is the list of active sessions (Manage them)
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar h-[50vh] max-h-[60vh] overflow-y-auto px-4">
          {loading ? (
            new Array(4).fill("").map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 overflow-hidden p-3 bg-card py-4 ring-1 ring-foreground/10 mx-auto w-full max-w-sm mb-4 rounded-lg"
              >
                <Skeleton className="rounded-lg h-4 w-5/12" />
                <Skeleton className="rounded-lg h-3 w-7/12" />
                <Skeleton className="rounded-lg h-3 w-9/12" />
                <Separator />
                <div className="flex gap-2 justify-start items-end">
                  <Skeleton className="rounded-lg h-3.5 w-4/12" />
                  <Skeleton className="rounded-lg h-3 w-5/12" />
                </div>
                <div className="flex gap-2 justify-start items-end">
                  <Skeleton className="rounded-lg h-3.5 w-5/12" />
                  <Skeleton className="rounded-lg h-3 w-7/12" />
                </div>
              </div>
            ))
          ) : sessionsList.length > 0 ? (
            sessionsList.map((s) => {
              const isCurrent = mySession?.session?.id === s.id;
              return (
                <Card
                  key={s.id}
                  size="sm"
                  className={`mx-auto w-full max-w-sm mb-4 rounded-lg ${
                    isCurrent ? "border-2 border-blue-300" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle>
                      {s?.ipAddress || "Unknown IP Address"}
                    </CardTitle>
                    <CardDescription>
                      {userAgentParser(s.userAgent)}
                    </CardDescription>
                    <Separator />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1">
                    <TimeRow label="Created" value={s.createdAt} />
                    <TimeRow label="Last active" value={s.updatedAt} />
                    <TimeRow label="Expires" value={s.expiresAt} isExpiry />
                  </CardContent>
                  {!isCurrent && (
                    <CardFooter>
                      <Button
                        disabled={revokingToken === s.token || revokingOthers}
                        onClick={() => handleRevokeOne(s.token)}
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer w-max ml-auto rounded-lg"
                      >
                        {revokingToken === s.token ? "Revoking..." : "Revoke"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No active sessions found.
            </p>
          )}
        </div>

        <DialogFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="cursor-pointer rounded-lg"
                disabled={loading || sessionsList.length <= 1 || revokingOthers}
              >
                {revokingOthers ? "Revoking..." : "Revoke Rest"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center text-lg gap-2 text-destructive">
                  <WarningDiamondIcon weight="bold" className="size-4" />
                  Are you sure?
                </DialogTitle>
                <DialogDescription>
                  It will revoke all sessions except current
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer rounded-lg pt-0.5"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    className="cursor-pointer rounded-lg"
                    onClick={handleRevokeRest}
                    variant="destructive"
                  >
                    <TrashIcon weight="bold" className="size-4" /> Yes! Revoke
                    Rest
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DialogClose asChild>
            <Button className="cursor-pointer rounded-lg" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveSessions;
