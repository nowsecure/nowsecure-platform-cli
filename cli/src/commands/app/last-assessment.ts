import { Assessment } from "@nowsecure/platform-lib/lib/types";
import { appRefArgs, appRefFlags, getFilter, resolveAppRef } from "../../utils";
import { ShowAssessmentBase } from "../assessment/show";

export default class LastAssessment extends ShowAssessmentBase {
  static aliases = ["app:last"];
  static description =
    "Show the details and findings of the last complete assessment for an application";

  static examples = [
    `<%= config.bin %> <%= command.id %> 24891ee6-698e-4a55-bb27-adbfa4694787`,
  ];

  static args = { ...appRefArgs };
  static flags = { ...ShowAssessmentBase.flags, ...appRefFlags };

  async run(): Promise<Assessment> {
    const { args, flags, platform } = await this.parseClient(LastAssessment);
    const filter = getFilter(flags);

    const appRef = await resolveAppRef(platform, args, flags, this);
    const apps = await platform.listApplications(
      {
        refs: appRef,
        lastAssessment: true,
        includeReport: flags.findings,
        includeState: flags.state,
        includeConfig: flags.config,
        includeDependencies: flags.dependencies,
        includeBuild: flags.build,
      },
      filter
    );

    const app = apps[0];
    const assessment = apps[0].latestCompleteAssessment;
    if (!assessment) {
      this.error(`${app.title || app.packageKey} has no completed assessments`);
    }

    this.showAssessment(assessment, flags, { ref: true });

    return assessment;
  }
}
