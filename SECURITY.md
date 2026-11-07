# Security

## Scope

This repository is a testnet demo built for BUIDL CTC 2026 Fall. It is not audited and it does not
hold real funds or real assets. Reports about the contracts, the server, the proof flow, and the
frontend wallet interactions are all in scope.

## Reporting

Use the repository Security tab and choose **Report a vulnerability** to open a private advisory.
Do not open a public issue for a vulnerability.

Include the affected contract or file, the impact, and the steps to reproduce. If a transaction is
involved, include the chain and hash. Reports are handled on a best-effort basis; there is no
bounty.

## Known limitations

Read the Limitations section of the README first. These are known and documented:

- `OwnershipVerifier.verifyAndMintReceipt` is `onlyOwner` and sets `owned` to true without reading
  it from the proof. The precompile proof is checked by the SDK before submission.
- `mintTimeValid` and `fromApprovedMinter` are stored but not enforced.
- The server signs with a hot `DEPLOYER_PRIVATE_KEY` from its environment.
- The faucet and demo endpoints are unauthenticated by design on testnet.
- The asset token, stablecoins, and property metadata are fixtures.

## Out of scope

- Loss of testnet funds.
- Render free tier downtime or cold starts.
- Economic design of the mock properties.
- Issues that require a compromised deployer key or a modified deployment.
