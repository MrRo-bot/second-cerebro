"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, formatRelative } from "date-fns";

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

import {
  listSessions,
  revokeSession,
  revokeOtherSessions,
  useSession,
} from "@/lib/auth-client";
import { renderToast, userAgentParser } from "@/lib/utils";

import { SessionType } from "@/types/user";
import { TrashIcon, WarningDiamondIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";

const ActiveSessions = () => {
  const { data: mySession } = useSession();
  const router = useRouter();
  const [sessionsList, setSessionsList] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);

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
          message: `${error?.code ?? "Error"} ${error?.status ?? ""}: ${error?.message ?? "Failed to load sessions"}`,
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
      prev.filter((p) => p.token === mySession?.session?.token),
    );
    renderToast({
      status: "success",
      message: "Ended all other sessions",
    });
    router.refresh();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
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
                    <span className="text-slate-500">
                      {"Last created " +
                        format(s.createdAt, "dd'/'MM'/'yy 'at' HH:mm aa")}
                    </span>
                    <Separator />
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-300 font-heading">
                          Expiring At:{" "}
                        </span>
                        <span className="text-slate-600">
                          {format(s.expiresAt, "do 'of' MMMM 'at' HH:mm aa")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-300 font-heading">
                          Last Updated:{" "}
                        </span>
                        <span className="text-slate-600">
                          {formatRelative(
                            s.updatedAt,
                            new Date(),
                          ).toLocaleUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  {s.token !== mySession?.session?.token && (
                    <CardFooter>
                      <Button
                        disabled={revokingToken === s.token}
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
                disabled={sessionsList.length <= 1 || revokingOthers}
              >
                Revoke Rest
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