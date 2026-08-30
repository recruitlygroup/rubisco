---
title: What "offfline-first" actually means on a farm
slug: what-offline-first-actually-means-on-a-farm
date: 2026-08-30
excerpt: Connectivity on a working farm is not a straight line — it is patchy, seasonal and sometimes gone for days. Here is how we design around that instead of around it.
tags: offline-first, software, field-notes
categories: Engineering
published: true
---

Most software gets built assuming a stable connection, then has "offline mode" added as an afterthought — a banner that says *you are offline*, and not much else.

That does not hold up on a working farm. Connectivity is patchy, weather-dependent, and sometimes gone for days during the monsoon. If the system stops working the moment the signal drops, it was never really built for the field.

## What we do differently

Every record — a breeding event, a moisture reading, a delivery — is written to the device first, full stop. Syncing to the server is a background concern the person entering data should never have to think about.

That single decision changes almost everything else about how the system is built: conflict resolution, storage limits on cheap devices, and how we test. It is slower to build. It is also the only version that actually gets used six months in.
