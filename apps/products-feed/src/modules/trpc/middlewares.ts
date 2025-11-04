import { createLogger } from "../../logger";
import { middleware } from "./trpc-server";

export const attachLogger = middleware(async ({ ctx, next, type, path }) => {
  const loggerName = `tRPC ${type} ${path.replace(/\./g, "/")}`;

  const logger = createLogger(loggerName, {
    requestType: type,
    path,
    saleorApiUrl: ctx.saleorApiUrl,
  });

  const start = Date.now();

  logger.info(`Requested received`);

  const result = await next({
    ctx: {
      logger,
    },
  });
  const durationMs = Date.now() - start;

  if (result.ok) {
    logger.info(`Response successful`, { durationMs });
  } else {
    logger.info(`Response with error`, { durationMs });
  }

  return result;
});
