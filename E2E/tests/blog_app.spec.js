const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog App', () => {

    beforeEach(async ({ page, request }) => {
        // create user and clean Mongo dbs
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                username: 'Siron',
                name: 'Cedric',
                password: 'test123',
            }
        })
        await request.post('http://localhost:3001/api/users', {
            data: {
                username: 'Kinu',
                name: 'Brian',
                password: 'test456',
            }
        })

        await page.goto('http://localhost:5173')

      })    

    test('login form is shown', async ({ page }) => {
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Siron', 'test123')
            await expect(page.getByText('Siron logged in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'Siron', 'test1')
    
            // await expect(page.getByText('The username or password is incorrect')).toBeVisible()
            const errorDiv = await page.locator('.errorMessage')
            await expect(errorDiv).toContainText('The username or password is incorrect')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
            await expect(page.getByText('Siron logged in')).not.toBeVisible()
    
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Siron', 'test123')
            await createBlog(page, 'Ceddys blog', 'Cedric', 'https://ceddy.com')
        })

        test('a new blog can be created', async ({ page }) => {
            const errorDiv = await page.locator('.errorMessage')
            await expect(errorDiv).toContainText('Ceddys blog')
        })

        test('a new blog can be liked', async ({ page }) => {
            await page.getByRole('button', {name: 'view'}).click()
            await page.getByRole('button', {name: 'like'}).click()
            await expect(page.getByText('1')).toBeVisible()
        })

        test('user can delete blog', async ({ page }) => {
            await page.getByRole('button', {name: 'view'}).click()
            page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Remove blog')
                await dialog.accept()
            });
            await page.getByRole('button', {name: 'remove'}).click()
            await expect(page.getByText('Ceddys blog')).not.toBeVisible()
        })
        
        test('only user who created blog can see remove button', async ({ page }) => {
            await page.getByRole('button', {name: 'logout'}).click()
            await loginWith(page, 'Kinu', 'test456')
            await page.getByRole('button', {name: 'view'}).click()
            await expect(page.getByText('remove')).not.toBeVisible()

        })
    })


})