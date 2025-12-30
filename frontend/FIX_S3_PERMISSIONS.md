# Fix S3 Permissions for memory-frontend-s3

Your bucket: **memory-frontend-s3**
Region: **us-east-1**
Current status: 403 Forbidden ❌

## Option 1: AWS Console (Easiest)

### Step 1: Unblock Public Access

1. Go to: https://s3.console.aws.amazon.com/s3/buckets/memory-frontend-s3?region=us-east-1&tab=permissions
2. Under **"Block public access (bucket settings)"**, click **Edit**
3. **Uncheck ALL 4 boxes**:
   - [ ] Block public access to buckets and objects granted through new access control lists (ACLs)
   - [ ] Block public access to buckets and objects granted through any access control lists (ACLs)
   - [ ] Block public access to buckets and objects granted through new public bucket or access point policies
   - [ ] Block public and cross-account access to buckets and objects through any public bucket or access point policies
4. Click **Save changes**
5. Type **`confirm`** and click **Confirm**

### Step 2: Set Bucket Policy

1. Still on the **Permissions** tab
2. Scroll down to **"Bucket policy"**
3. Click **Edit**
4. **Copy and paste this EXACTLY**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::memory-frontend-s3/*"
    }
  ]
}
```

5. Click **Save changes**

### Step 3: Verify Static Website Hosting

1. Go to **Properties** tab
2. Scroll to bottom: **"Static website hosting"**
3. Should show:
   - Status: **Enabled** ✅
   - Hosting type: **Host a static website**
   - Index document: **index.html**
   - Bucket website endpoint: http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com

---

## Option 2: Make Individual Files Public (If Policy Fails)

### AWS Console:
1. Go to **Objects** tab in your bucket
2. **Select all files** (check the box at the top)
3. Click **Actions** → **Make public using ACL**
4. Click **Make public**

### AWS CLI:
```bash
aws s3 sync s3://memory-frontend-s3 s3://memory-frontend-s3 --acl public-read
```

---

## Option 3: CLI Commands (For Your Specific Bucket)

```bash
# 1. Remove public access block
aws s3api put-public-access-block \
  --bucket memory-frontend-s3 \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 2. Create and apply bucket policy
cat > bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::memory-frontend-s3/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket memory-frontend-s3 --policy file://bucket-policy.json

# 3. Verify static website hosting is enabled
aws s3api get-bucket-website --bucket memory-frontend-s3

echo "✅ Done! Test at: http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com"
```

---

## Test After Fixing

Once you've applied the permissions:

```bash
# Test if index.html is accessible
curl http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/

# Should return HTML content, not 403 error
```

Or open in browser:
**http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/**

---

## Troubleshooting

### Still Getting 403?

**Check 1:** Public access block status
```bash
aws s3api get-public-access-block --bucket memory-frontend-s3
```

Should show all `false`:
```json
{
  "BlockPublicAcls": false,
  "IgnorePublicAcls": false,
  "BlockPublicPolicy": false,
  "RestrictPublicBuckets": false
}
```

**Check 2:** Bucket policy exists
```bash
aws s3api get-bucket-policy --bucket memory-frontend-s3 --query Policy --output text
```

Should show the policy with `s3:GetObject` permission.

**Check 3:** Static website hosting enabled
```bash
aws s3api get-bucket-website --bucket memory-frontend-s3
```

Should show:
```json
{
  "IndexDocument": {
    "Suffix": "index.html"
  },
  "ErrorDocument": {
    "Key": "index.html"
  }
}
```

### AWS Learner Lab Limitations

If AWS CLI commands fail with permission errors, **use the AWS Console** - it often works even when CLI doesn't in Learner Lab.

---

## What Should Work After Fix

✅ Website URL: http://memory-frontend-s3.s3-website-us-east-1.amazonaws.com/
✅ Backend API: https://memoria-api.mkaltenr.workers.dev
✅ Full application working

The frontend will connect to your Cloudflare Workers backend automatically!
