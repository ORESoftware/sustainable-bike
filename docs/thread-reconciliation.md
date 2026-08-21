# Thread reconciliation

This repository resumes the sustainable-bicycle work from the August 21, 2026 account threads and consolidates the overlapping requirements into one auditable source tree:

- mechanically captive wheels rather than exposed quick-release wheels;
- single-sided front and rear support;
- solid or strongly puncture-resistant tires;
- a small rear-hub motor with a 25 mph flat-ground engineering target;
- one chainring, internal rear ratios, no derailleur, and no manual gear switching;
- a non-metallic aramid/Kevlar-class dry belt; and
- a sustainable, repairable material and service architecture.

The literal “wheel and frame are one part” wording is resolved as a mechanically captive wheel cartridge because a rigid one-piece wheel/frame cannot rotate. The CAD, tests, and architecture record preserve the anti-theft goal while making the kinematic constraint explicit.

The recovered v0.1 history already used a feature branch and a merge commit. The v0.2 power/export hardening continues that policy and is merged without rebasing.

Unrelated unfinished account threads are not silently mutated from this repository. Cross-project work retains its own repository, issue, branch, authorization, and exact-head verification evidence. A separate handoff artifact records the broader account reconciliation; this safety-critical repository contains only sustainable-bike implementation and its direct provenance.
