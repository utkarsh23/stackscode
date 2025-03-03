/**
 * @file custom welcome page
 * Based on https://github1s.com/conwnet/github1s/blob/HEAD/vscode-web-github1s/src/vs/workbench/contrib/welcome/gettingStarted/browser/gettingStarted.ts
 */

import "vs/css!./welcomePage";
import { IConfigurationService } from "vs/platform/configuration/common/configuration";
import { IProductService } from "vs/platform/product/common/productService";
import { escape } from "vs/base/common/strings";
import { localize } from "vs/nls";
import * as marked from "vs/base/common/marked/marked";
import { ICommandService } from "vs/platform/commands/common/commands";
const configurationKey = "workbench.startupEditor";

const buildTemplate = () => `
 <div class="welcomePageContainer">
   <div class="welcomePage" role="document">
     <div class="title">
       <h1 class="caption">${escape(
         localize("welcomePage.vscode", "Visual Studio Code")
       )}</h1>
       <p class="subtitle detail">
         View source of deployed Stacks smart contracts in VS Code
       </p>
     </div>
     <div class="row">
       <div class="splash">
         <div class="section">
           <p class="usage-guide">
             While browsing smart contract code on <a href="https://explorer.stacks.co/" rel="nofollow">Stacks Explorer</a> just change base URL from <code>.stacks.co</code> to <code>.stackscode.co</code>. This will open Visual Studio Code instance and fetch the clarity code using Stacks API.
           </p>
         </div>
         <div class="section help">
           <h2 class="caption">${escape(
             localize("welcomePage.help", "Help")
           )}</h2>
           <ul>
             <li><a href="https://github.com/utkarsh23/stackscode" target="_blank">StacksCode Repository</a></li>
             <li><a href="https://github.com/microsoft/vscode" target="_blank">VS Code Repository</a></li>
             <li><a href="https://code.visualstudio.com/docs" target="_blank">VS Code Documentation</a></li>
           </ul>
         </div>
         <p class="showOnStartup"><input type="checkbox" id="showOnStartup" class="checkbox"/> <label class="caption" for="showOnStartup">${escape(
           localize("welcomePage.showOnStartup", "Show welcome page on startup")
         )}</label></p>
       </div>
       <div class="commands">
         <div class="section examples">
         <h2 class="caption">Examples</h2>
         <div class="list">
           <div class="item">
             <a class="button" href="https://explorer.stackscode.co/txid/SP000000000000000000002Q6VF78.bns?chain=mainnet">
               <h3 class="caption">View Example on <strong>Mainnet</strong></h3>
               <span class="detail">SP000000000000000000002Q6VF78.bns</span>
             </a>
           </div>
           <div class="item">
             <a class="button" href="https://explorer.stackscode.co/txid/ST1B4ZCZB59G2YR4TDYNDWP7FWAPTX03AP9KHH2GE.hc-alpha?chain=testnet">
               <h3 class="caption">View Example on <strong>Testnet</strong></h3>
               <span class="detail">ST1B4ZCZB59G2YR4TDYNDWP7FWAPTX03AP9KHH2GE.hc-alpha</span>
             </a>
           </div>
         </div>
         </div>
         <div class="section learn">
           <h2 class="caption">${escape(
             localize("welcomePage.learn", "Learn")
           )}</h2>
           <div class="list">
             <div class="item showCommands"><button class="show-all-commands"><h3 class="caption">${escape(
               localize("welcomePage.showCommands", "Find and run all commands")
             )}</h3> <span class="detail">${escape(
  localize(
    "welcomePage.showCommandsDescription",
    "Rapidly access and search commands from the Command Palette ({0})"
  )
).replace(
  "{0}",
  '<span class="shortcut" data-command="workbench.action.showCommands"></span>'
)}</span></button></div>
             <div class="item showInterfaceOverview"><button class="show-interface-overview"><h3 class="caption">${escape(
               localize("welcomePage.interfaceOverview", "Interface overview")
             )}</h3> <span class="detail">${escape(
  localize(
    "welcomePage.interfaceOverviewDescription",
    "Get a visual overlay highlighting the major components of the UI"
  )
)}</span></button></div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
 `;

export class StacksViewerWelcomePage {
  private container?: HTMLElement;

  constructor(
    @IConfigurationService
    private readonly configurationService: IConfigurationService,
    @IProductService private readonly productService: IProductService,
    @ICommandService private readonly commandService: ICommandService
  ) {}

  public render() {
    if (this.container) {
      return this.container;
    }
    const content = marked(buildTemplate());
    this.container = document.createElement("div");
    this.container.classList.add("stackscodeWelcomePage");
    this.container.innerHTML = content;
    this.onReady(this.container);

    return this.container;
  }

  onReady(container: HTMLElement) {
    const enabled =
      this.configurationService.getValue(configurationKey) === "welcomePage";
    const showOnStartup = <HTMLInputElement>(
      container.querySelector("#showOnStartup")
    );
    if (enabled) {
      showOnStartup.setAttribute("checked", "checked");
    }
    showOnStartup.addEventListener("click", (_e) => {
      this.configurationService.updateValue(
        configurationKey,
        showOnStartup.checked ? "welcomePage" : "newUntitledFile"
      );
    });

    const prodName = container.querySelector(
      ".welcomePage .title .caption"
    ) as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (prodName) {
      prodName.textContent = this.productService.nameLong;
    }

    container
      .querySelector(".show-all-commands")
      ?.addEventListener("click", () =>
        this.commandService.executeCommand("workbench.action.showCommands")
      );
    container
      .querySelector(".show-interface-overview")
      ?.addEventListener("click", () =>
        this.commandService.executeCommand(
          "workbench.action.showInterfaceOverview"
        )
      );
  }
}
