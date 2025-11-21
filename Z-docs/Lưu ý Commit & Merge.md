# Lưu ý ngắn gọn khi Commit & Merge vào `main`

## 1) Commit

* **Nhỏ & rõ ràng**: Mỗi commit = 1 thay đổi logic.
* **Thông điệp chuẩn** (Conventional Commits):

  * `feat: nội dung....` thêm tính năng
  * `fix: ...` sửa lỗi
  * `chore: ...` việc lặt vặt (build, deps)
  * `refactor: ...` đổi cấu trúc không đổi hành vi
  * `docs: ...`, `test: ...`, `perf: ...`, `style: ...`
* **Mô tả ngắn trước, chi tiết sau**: dòng đầu ≤ 72 ký tự; phần thân giải thích *what/why*.
* **Không commit rác**: build, `node_modules`, log, secrets → dùng `.gitignore`.
* **Tự kiểm tra trước**: chạy lint/test/format.
* **Ký liên kết issue** (nếu có): `Refs #123` hoặc `Closes #123`.

## 2) Làm việc trên nhánh feature

* Tạo từ `main` mới nhất:

  ```bash
  git checkout main && git pull
  git checkout -b feature/ten-ngu-canh
  ```
* Đồng bộ định kỳ với `main` để giảm conflict:

  ```bash
  git fetch origin
  git merge origin/main   # hoặc: git rebase origin/main
  ```

## 3) Mở Pull Request (PR)

* **PR nhỏ, tập trung một mục tiêu.**
* **Checklist PR**:

  * [ ] Pass lint/format/test CI
  * [ ] Không đổi API công khai ngoài dự định
  * [ ] Không file thừa/secret
  * [ ] Mô tả ảnh hưởng & cách rollback
  * [ ] 2+ reviewer (tuỳ team)
* **Ảnh chụp màn hình** (nếu UI) & hướng dẫn test nhanh.

## 4) Merge vào `main`

* **Luôn cập nhật trước khi merge**: giải conflict trên nhánh feature, không merge bừa.
* **Chọn kiểu merge**:

  * *Squash & merge* → lịch sử gọn (khuyến nghị).
  * *Rebase & merge* → tuyến tính, cần kỷ luật.
  * *Merge commit* → giữ lịch sử đầy đủ.
* **Đảm bảo xanh CI** (build, unit/e2e, security scan).
* **Tag phiên bản** nếu release: `vX.Y.Z` (SemVer).
* **Triển khai an toàn**: canary/feature flag/rollout dần (nếu có).

## 5) Bảo vệ `main` (Branch Protection)

* Bật **Protected Branch**: cấm push trực tiếp.
* Bắt buộc **PR review**, **status checks** (CI xanh), **no force-push**.
* Bắt buộc **linear history** (tuỳ chọn).
* Yêu cầu **signed commits**/**CODEOWNERS** cho vùng code nhạy cảm.

## 6) Quy tắc xử lý conflict

1. Kéo `main` mới nhất vào nhánh feature (`merge` hoặc `rebase`).
2. Mở file xung đột ⇒ đọc & giữ ý định logic của cả hai bên.
3. Chạy test, build, kiểm tra UI sau khi sửa.
4. Tự review diff lần cuối trước khi push.

## 7) Rollback & Hotfix

* **Rollback nhanh**: `git revert <sha>` (an toàn trên `main`).
* **Hotfix**: nhánh `hotfix/...` từ `main` → PR → merge → tag `patch`.

## 8) Mẫu commit message

```
feat(auth): thêm đăng nhập bằng Google

- thêm nút Sign in with Google
- lưu token vào httpOnly cookie
- closes #421
```

## 9) Lệnh tham khảo nhanh

```bash
# Tạo nhánh & đẩy lên remote
git checkout -b feature/abc && git push -u origin feature/abc

# Đồng bộ nhánh feature với main
git fetch origin && git merge origin/main
# hoặc giữ lịch sử tuyến tính:
git fetch origin && git rebase origin/main

# Revert an toàn trên main
git checkout main && git pull && git revert <sha> && git push
```

---

**Nguyên tắc vàng**: *nhỏ, rõ, có kiểm thử, có review, CI xanh, merge có kế hoạch*.
