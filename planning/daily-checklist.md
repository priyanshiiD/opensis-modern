# Daily Delivery Checklist (15-Day MERN Migration)

## 1. Morning Standup (15-20 mins)
- [ ] Yesterday demo shared by each owner
- [ ] Today's 1 primary outcome per person defined
- [ ] Blockers identified with owner + ETA
- [ ] Any scope change request rejected or swapped (one-in, one-out)
- [ ] API contract changes logged before coding starts

## 2. Development Hygiene (during day)
- [ ] Branch created from latest develop
- [ ] Ticket linked in branch name and PR title
- [ ] Small PR target (prefer <= 400 net lines)
- [ ] No hardcoded secrets or credentials
- [ ] Error handling added (not only happy path)
- [ ] Role/permission checks implemented where needed

## 3. Testing Gate (before PR)
- [ ] Happy path tested locally
- [ ] 1 failure path tested locally
- [ ] API validation errors verified
- [ ] UI loading/error/empty states verified
- [ ] Existing smoke tests still pass

## 4. PR Review Gate
- [ ] Acceptance criteria copied into PR description
- [ ] Screenshots/video added for UI changes
- [ ] DB migration note added (if schema changed)
- [ ] At least 1 senior review completed
- [ ] Comments resolved, no unresolved critical threads

## 5. Evening Integration (30 mins)
- [ ] All completed tickets merged to develop
- [ ] Integration build run on develop
- [ ] Demo of each track done (Core, Students, Attendance/Grades, QA)
- [ ] Critical bugs labeled and assigned same day
- [ ] Next day priorities locked

## 6. Day-10 Major Completion Check
- [ ] Auth + role guard working end-to-end
- [ ] Students module usable end-to-end
- [ ] Attendance module usable end-to-end
- [ ] Grades basic flow usable end-to-end
- [ ] Basic dashboard visible with real data

## 7. Stop-Doing List (strict)
- [ ] No new feature accepted without swapping out another
- [ ] No long-running feature branch (>2 days) without merge
- [ ] No unreviewed direct push to main
- [ ] No "we will test later" merges
